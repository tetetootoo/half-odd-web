import { PlainTextDoc } from '../PlainTextDoc/PlainTextDoc';
import { MarkdownDoc } from '../CaseStudy/MarkdownDoc';
import { ConceptDiagram } from '../CaseStudy/ConceptDiagram';
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { desktopItems, type DesktopItem } from '../../data/desktopContent';
import {
  layoutTextDoc,
  parseInline,
  type FlowDiagramData,
  type SplitMediaSection,
  type TextTier,
} from '../../data/textBlocks';
import { useDrag, type Position } from '../../hooks/useDrag';
import type { ManagedWindow } from '../../hooks/useWindowManager';
import { useTrash } from '../Trash/TrashContext';
import styles from './Window.module.css';

function formatNoteDateShort(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function formatNoteDateLong(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${datePart} at ${timePart}`;
}

// The usable desktop, in px relative to the desktop element: below the menu
// bar and above the dock.
export interface WorkArea {
  top: number;
  bottom: number;
  width: number;
  height: number;
}

interface Geometry {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface WindowProps {
  item: DesktopItem;
  managed: ManagedWindow;
  zIndex: number;
  isActive: boolean;
  getWorkArea: () => WorkArea;
  onFocus: () => void;
  onClose: () => void;
  onFinishClose: (hadFocus: boolean) => void;
  onFinishMinimize: (hadFocus: boolean) => void;
  onOpenItem: (id: string) => void;
}

const CASCADE_STEP_PX = 28;
const CASCADE_WRAP = 6;
// Gap between a maximized window and the menu bar, dock and screen edges.
const MAXIMIZE_INSET_PX = 10;
// Must match .geometryAnimating's transition duration.
const GEOMETRY_ANIMATION_MS = 220;
// Comfortably past the longest exit animation (200ms minimize).
const EXIT_ANIMATION_FALLBACK_MS = 400;
// How much of the title bar must stay on screen while dragging.
const TITLE_BAR_REACH_PX = 60;
const TITLE_BAR_HEIGHT_PX = 38;

function MediaFrame({ item }: { item: DesktopItem }) {
  if (!item.mediaSrc) {
    return <div className={styles.placeholder}>Image / video placeholder</div>;
  }
  if (item.mediaType === 'video') {
    return (
      <video
        className={styles.media}
        src={item.mediaSrc}
        poster={item.posterSrc}
        muted
        autoPlay
        loop
        playsInline
      />
    );
  }
  return <img className={styles.media} src={item.mediaSrc} alt={item.label} />;
}

function BrowserFrame({ item }: { item: DesktopItem }) {
  const [reloadKey, setReloadKey] = useState(0);
  const url = item.link?.url;

  if (!url) {
    return <div className={styles.placeholder}>No site linked</div>;
  }

  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <div className={styles.browserFrame}>
      <div className={styles.browserToolbar}>
        <button
          type="button"
          className={styles.browserReload}
          onClick={() => setReloadKey((k) => k + 1)}
          aria-label="Reload"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89M13.5 2v3.5H10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className={styles.browserAddress}>
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
            <path
              d="M3 5.5V4a3 3 0 1 1 6 0v1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect x="2" y="5.5" width="8" height="5.5" rx="1" fill="currentColor" />
          </svg>
          {displayUrl}
        </span>
      </div>
      <div className={styles.browserViewport}>
        <iframe
          key={reloadKey}
          className={styles.browserIframe}
          src={url}
          title={item.windowTitle}
        />
        {item.showScrollHint && (
          <span className={styles.scrollHint} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            scroll
          </span>
        )}
      </div>
    </div>
  );
}

// Type 4: fixed 480x440 overlay — the media's longer edge is pinned to
// 440px (the box's own height) and the shorter edge follows the image's
// natural aspect ratio, which is exactly what object-fit: contain against a
// 440x440 box gives us, centered in the slightly wider 480px frame.
function ImageOverlayFrame({ item }: { item: DesktopItem }) {
  return (
    <div className={styles.imageBox}>
      {!item.mediaSrc ? (
        <div className={styles.imageBoxPlaceholder}>Image / video placeholder</div>
      ) : item.mediaType === 'video' ? (
        <video
          className={styles.imageBoxMedia}
          src={item.mediaSrc}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          poster={item.posterSrc}
        />
      ) : (
        <img className={styles.imageBoxMedia} src={item.mediaSrc} alt={item.label} />
      )}
    </div>
  );
}

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const HEADING_PREFIX = '## ';

function notePreviewText(paragraph: string): string {
  return paragraph.startsWith(HEADING_PREFIX) ? paragraph.slice(HEADING_PREFIX.length) : paragraph;
}

function NotesFrame({ item }: { item: DesktopItem }) {
  const notes = item.notes ?? [];
  const [selectedId, setSelectedId] = useState(notes[0]?.id);
  const selected = notes.find((note) => note.id === selectedId) ?? notes[0];

  if (!selected) {
    return <div className={styles.placeholder}>No notes yet</div>;
  }

  return (
    <div className={styles.notesFrame}>
      <div className={styles.notesSidebar}>
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            className={`${styles.noteListItem} ${
              note.id === selected.id ? styles.noteListItemActive : ''
            }`}
            onClick={() => setSelectedId(note.id)}
          >
            <span className={styles.noteListTitle}>{note.title}</span>
            <span className={styles.noteListMeta}>
              <span className={styles.noteListDate}>{formatNoteDateShort(note.date)}</span>
              <span className={styles.noteListPreview}>{notePreviewText(note.paragraphs[0] ?? '')}</span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.notesDetail}>
        <div className={styles.notesDetailDate}>{formatNoteDateLong(selected.date)}</div>
        <h2 className={styles.notesDetailTitle}>{selected.title}</h2>
        {selected.paragraphs.map((paragraph, i) => {
          if (paragraph.startsWith(HEADING_PREFIX)) {
            return (
              <h3 key={i} className={styles.notesDetailSubheading}>
                {paragraph.slice(HEADING_PREFIX.length)}
              </h3>
            );
          }
          if (EMAIL_PATTERN.test(paragraph)) {
            return (
              <p key={i} className={styles.notesDetailParagraph}>
                <a className={styles.notesDetailLink} href={`mailto:${paragraph}`}>
                  {paragraph}
                </a>
              </p>
            );
          }
          return (
            <p key={i} className={styles.notesDetailParagraph}>
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
}

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

function MailFrame({ item }: { item: DesktopItem }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item.formEndpoint || status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch(item.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      if (response.ok) {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.mailFrame}>
      <div className={styles.mailSidebar}>
        <div className={styles.mailListItem}>
          <div className={styles.mailListHeader}>
            <span className={styles.mailListSender}>{name || 'you'}</span>
            <span className={styles.mailListDate}>now</span>
          </div>
          <div className={styles.mailListSubject}>{item.mailSubject}</div>
          <div className={styles.mailListPreview}>{message || 'Hi Theresa, ...'}</div>
        </div>
      </div>
      <div className={styles.mailDetail}>
        <form className={styles.mailForm} onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value={item.mailSubject} />
          <div className={styles.mailFormRow}>
            <span className={styles.mailFormLabel}>To:</span>
            <span className={styles.mailFormStatic}>{item.mailTo}</span>
          </div>
          <div className={styles.mailFormRow}>
            <span className={styles.mailFormLabel}>Subject:</span>
            <span className={styles.mailFormStatic}>{item.mailSubject}</span>
          </div>
          <div className={styles.mailFormRow}>
            <label className={styles.mailFormLabel} htmlFor="mail-name">
              From:
            </label>
            <input
              id="mail-name"
              name="name"
              className={styles.mailFormInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.mailFormRow}>
            <label className={styles.mailFormLabel} htmlFor="mail-email">
              Email:
            </label>
            <input
              id="mail-email"
              name="email"
              type="email"
              className={styles.mailFormInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <textarea
            name="message"
            className={styles.mailFormMessage}
            placeholder="Hi Theresa, ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <div className={styles.mailFormFooter}>
            <button type="submit" className={styles.mailFormSend} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent ✓' : 'Send'}
            </button>
            {status === 'error' && (
              <span className={styles.mailFormError}>
                Something went wrong — try again or email {item.mailTo} directly.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const desktopItemsById = new Map(desktopItems.map((entry) => [entry.id, entry]));

// Offsets of the icon glyph inside a desktop icon (see DesktopIcon.module.css),
// so an item dragged out of the Trash lines up with the icon it becomes.
const DESKTOP_GLYPH_INSET = { x: 17, y: 8 };

function TrashTile({
  id,
  label,
  thumbSrc,
  restorable,
}: {
  id: string;
  label: string;
  thumbSrc?: string;
  restorable: boolean;
}) {
  const trash = useTrash();
  const thumbRef = useRef<HTMLImageElement>(null);
  const grabRef = useRef<Position>({ x: 0, y: 0 });
  const { isDragging, handlers } = useDrag({
    disabled: !restorable,
    onDragStart: (_e, origin) => {
      const thumb = thumbRef.current?.getBoundingClientRect();
      if (!thumb) return;
      grabRef.current = {
        x: origin.x - thumb.left + DESKTOP_GLYPH_INSET.x,
        y: origin.y - thumb.top + DESKTOP_GLYPH_INSET.y,
      };
    },
    onDragMove: (_offset, e) => trash.onDragOutMove(id, { x: e.clientX, y: e.clientY }, grabRef.current),
    onDragEnd: (_offset, e) => trash.onDragOutEnd(id, { x: e.clientX, y: e.clientY }),
  });

  return (
    <div className={`${styles.trashItem} ${isDragging ? styles.trashItemDragging : ''}`}>
      <button
        type="button"
        className={`${styles.trashOpen} ${restorable ? styles.trashOpenDraggable : ''}`}
        aria-label={`Open ${label}`}
        onClick={(e) => trash.onOpen(id, e.currentTarget)}
        {...handlers}
      >
        {thumbSrc ? (
          <img
            ref={thumbRef}
            className={`${styles.trashThumb} ${restorable ? styles.trashThumbIcon : ''}`}
            src={thumbSrc}
            alt=""
            draggable={false}
          />
        ) : (
          <span className={styles.trashThumb} />
        )}
        <span className={styles.trashLabel}>{label}</span>
      </button>
      {restorable && (
        <button
          type="button"
          className={styles.trashPutBack}
          aria-label={`Put back ${label}`}
          title="Put Back"
          onClick={(e) => {
            // The tile disappears, so keep keyboard focus in the Trash.
            const tile = e.currentTarget.parentElement;
            const next =
              (tile?.nextElementSibling ?? tile?.previousElementSibling)?.querySelector('button') ??
              tile?.closest<HTMLElement>('[role="dialog"]');
            trash.onPutBack(id);
            requestAnimationFrame(() => next?.focus({ preventScroll: true }));
          }}
        >
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
            <path
              d="M4.5 2.5L2 5l2.5 2.5M2 5h5a3 3 0 0 1 0 6H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function TrashFrame() {
  const trash = useTrash();

  if (trash.entries.length === 0 && trash.builtIn.length === 0) {
    return <div className={styles.trashEmptyState}>Trash is empty.</div>;
  }

  return (
    <div className={styles.trashGrid}>
      {trash.entries.map((entry) => {
        const source = desktopItemsById.get(entry.id);
        return (
          <TrashTile
            key={entry.id}
            id={entry.id}
            label={entry.label}
            thumbSrc={source?.kind === 'audio' ? source.posterSrc : source?.iconSrc}
            restorable
          />
        );
      })}
      {trash.builtIn.map((entry) => (
        <TrashTile
          key={entry.id}
          id={entry.id}
          label={entry.label}
          thumbSrc={entry.iconSrc ?? entry.posterSrc ?? entry.mediaSrc}
          restorable={false}
        />
      ))}
    </div>
  );
}

function SplitSectionMedia({ data }: { data: SplitMediaSection }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className={styles.splitVisualPlaceholder}>preview coming soon</div>;
  }
  if (data.visualType === 'image') {
    return (
      <img
        className={styles.splitVisualMedia}
        src={data.visualSrc}
        alt=""
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <video
      className={styles.splitVisualMedia}
      src={data.visualSrc}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
    />
  );
}

// Reusable text+visual split section — desktop renders true side-by-side
// columns (orientation/textRatio configurable); the visual falls back to a
// same-size placeholder if its file 404s, so dropping the real asset in
// later needs no layout change.
function SplitSectionBlock({ data }: { data: SplitMediaSection }) {
  const textRatio = data.textRatio ?? 40;
  const visualRatio = 100 - textRatio;
  const reverse = data.orientation === 'visual-left';

  return (
    <div className={`${styles.splitSection} ${reverse ? styles.splitSectionReverse : ''}`}>
      <div className={styles.splitText} style={{ flex: `${textRatio} 1 0%` }}>
        {data.eyebrow && <div className={styles.splitEyebrow}>{data.eyebrow}</div>}
        {data.body.map((paragraph, pi) => (
          <p key={pi} className={styles.splitBody}>
            {paragraph}
          </p>
        ))}
        {data.statement && <p className={styles.splitStatement}>{data.statement}</p>}
      </div>
      <div className={styles.splitVisual} style={{ flex: `${visualRatio} 1 0%` }}>
        <SplitSectionMedia data={data} />
      </div>
    </div>
  );
}

const TEXT_TIER_CLASS: Record<TextTier, keyof typeof styles> = {
  eyebrow: 'tierEyebrow',
  h1: 'tierH1',
  introLarge: 'tierIntroLarge',
  metadata: 'tierMetadata',
  sectionHeading: 'tierSectionHeading',
  majorStatement: 'tierMajorStatement',
  body: 'tierBody',
};

// Restrained node/connector diagram — university/SAP-Graph trees, simple
// chains, small interaction sketches. Thin-bordered boxes, no fills beyond
// white, no gradients; used standalone or twice inside a FlowComparison.
function FlowDiagram({ data }: { data: FlowDiagramData }) {
  return (
    <div className={styles.flowDiagram}>
      {data.lines.map((line, li) => {
        if ('text' in line) {
          return (
            <div key={li} className={styles.flowText}>
              {line.text}
            </div>
          );
        }
        if ('connector' in line) {
          return (
            <div key={li} className={styles.flowConnector} aria-hidden="true">
              {line.connector}
            </div>
          );
        }
        return (
          <div key={li} className={styles.flowNodes}>
            {line.nodes.map((node, ni) => (
              <div
                key={ni}
                className={line.emphasize ? `${styles.flowNode} ${styles.flowNodeEmphasize}` : styles.flowNode}
              >
                {node}
              </div>
            ))}
          </div>
        );
      })}
      {data.caption && <p className={styles.flowCaption}>{data.caption}</p>}
    </div>
  );
}

function FlowComparisonBlock({ left, right }: { left: FlowDiagramData; right: FlowDiagramData }) {
  return (
    <div className={styles.flowComparison}>
      <FlowDiagram data={left} />
      <FlowDiagram data={right} />
    </div>
  );
}

// An ascending stack of labels, each rendered visibly larger than the
// last, suggesting one layer building on the next.
function LayerDiagram({ steps }: { steps: string[] }) {
  return (
    <div className={styles.layerDiagram}>
      {steps.map((step, si) => (
        <div key={si}>
          {si > 0 && (
            <div className={styles.flowConnector} aria-hidden="true">
              ↓
            </div>
          )}
          <div
            className={styles.layerStep}
            style={{
              padding: `${8 + si * 4}px ${18 + si * 8}px`,
              fontSize: `${13 + si * 2}px`,
              fontWeight: si === steps.length - 1 ? 700 : 400,
            }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

function NarrowText({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={styles.narrow}>
      {paragraphs.map((paragraph, pi) => (
        <p key={pi} className={styles.narrowParagraph}>
          {parseInline(paragraph).map((run, ri) =>
            run.bold ? <strong key={ri}>{run.text}</strong> : <span key={ri}>{run.text}</span>,
          )}
        </p>
      ))}
    </div>
  );
}

function EscalatingStatement({ first, second }: { first: string; second: string }) {
  return (
    <div className={styles.escalatingStatement}>
      <p className={styles.escalatingFirst}>{first}</p>
      <p className={styles.escalatingSecond}>{second}</p>
    </div>
  );
}

function WindowBody({
  item,
  onOpenItem,
}: {
  item: DesktopItem;
  onOpenItem: (id: string) => void;
}) {
  switch (item.kind) {
    case 'image':
      return <ImageOverlayFrame item={item} />;
    case 'markdown':
      return item.caseStudyId ? <MarkdownDoc caseStudyId={item.caseStudyId} onOpenItem={onOpenItem} /> : null;
    case 'text':
      if (item.plainText) return <PlainTextDoc lines={item.plainText} />;
      return (
        <div className={styles.textPad}>
          {item.textLines &&
            layoutTextDoc(item.textLines).map((entry, i) => {
              switch (entry.kind) {
                case 'text':
                  return (
                    <div key={i} className={styles[TEXT_TIER_CLASS[entry.tier]]}>
                      {parseInline(entry.text).map((run, ri) => {
                        const lines = run.text.split('\n');
                        const content = lines.flatMap((line, li) =>
                          li === 0 ? [line] : [<br key={`${ri}-${li}`} />, line],
                        );
                        return run.bold ? <strong key={ri}>{content}</strong> : <span key={ri}>{content}</span>;
                      })}
                    </div>
                  );
                case 'images':
                  return (
                    <div key={i} className={styles.textImageRow}>
                      {entry.images.map((src) => (
                        <img key={src} className={styles.textImage} src={src} alt="" />
                      ))}
                    </div>
                  );
                case 'image':
                  return (
                    <img
                      key={i}
                      className={styles.textImageFull}
                      src={entry.image}
                      alt={entry.alt ?? ''}
                    />
                  );
                case 'openLink':
                  return (
                    <button
                      key={i}
                      type="button"
                      className={styles.textLink}
                      onClick={() => onOpenItem(entry.openId)}
                    >
                      {entry.label}
                      <span aria-hidden="true"> ↗</span>
                    </button>
                  );
                case 'hrefLink':
                  return (
                    <a
                      key={i}
                      className={styles.textLink}
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  );
                case 'splitSection':
                  return <SplitSectionBlock key={i} data={entry.data} />;
                case 'conceptualDiagram':
                  return <ConceptDiagram key={i} diagram={entry.diagram} />;
                case 'flowDiagram':
                  return <FlowDiagram key={i} data={entry.data} />;
                case 'flowComparison':
                  return <FlowComparisonBlock key={i} left={entry.left} right={entry.right} />;
                case 'layerDiagram':
                  return <LayerDiagram key={i} steps={entry.steps} />;
                case 'narrow':
                  return <NarrowText key={i} paragraphs={entry.paragraphs} />;
                case 'escalatingStatement':
                  return <EscalatingStatement key={i} first={entry.first} second={entry.second} />;
                default:
                  return null;
              }
            })}
        </div>
      );
    case 'notes':
      return <NotesFrame item={item} />;
    case 'mail':
      return <MailFrame item={item} />;
    case 'about':
      return (
        <div className={styles.aboutDoc}>
          <div className={styles.aboutHeading}>{item.windowTitle}</div>
          <div className={styles.aboutTop}>
            {item.posterSrc && (
              <img className={styles.aboutPhoto} src={item.posterSrc} alt={item.label} />
            )}
            {item.aboutFields && (
              <div className={styles.aboutFields}>
                {item.aboutFields.map((field) => (
                  <div key={field.label} className={styles.aboutFieldRow}>
                    <span className={styles.aboutFieldLabel}>{field.label}</span>
                    {field.href ? (
                      <a className={styles.aboutFieldLink} href={field.href}>
                        {field.value}
                      </a>
                    ) : (
                      <span>{field.value}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {item.bioParagraphs && (
            <div className={styles.aboutBio}>
              {item.bioParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      );
    case 'trash':
      return <TrashFrame />;
    case 'browser':
      return <BrowserFrame item={item} />;
    case 'project':
      return <MediaFrame item={item} />;
    default:
      return <div className={styles.placeholder}>Screenshot / video placeholder</div>;
  }
}

export function Window({
  item,
  managed,
  zIndex,
  isActive,
  getWorkArea,
  onFocus,
  onClose,
  onFinishClose,
  onFinishMinimize,
  onOpenItem,
}: WindowProps) {
  const isProject = item.kind === 'project';
  const isImageKind = item.kind === 'image';
  const isAboutKind = item.kind === 'about';
  const isNotesKind = item.kind === 'notes';
  const isMailKind = item.kind === 'mail';
  const isTrashKind = item.kind === 'trash';
  const isBrowserKind = item.kind === 'browser';
  const isTextKind = item.kind === 'text' || item.kind === 'markdown';
  const isFileTitle = isTextKind || item.kind === 'notes';
  const isFlushDoc = isFileTitle || item.kind === 'about';
  const step = (managed.cascadeIndex % CASCADE_WRAP) * CASCADE_STEP_PX;
  const trash = useTrash();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // The window's on-screen box, relative to the desktop.
  const measure = (): Geometry => {
    const win = windowRef.current!.getBoundingClientRect();
    const desktop = (wrapperRef.current!.offsetParent as HTMLElement).getBoundingClientRect();
    return { left: win.left - desktop.left, top: win.top - desktop.top, width: win.width, height: win.height };
  };

  // Drag distance persists here across pointer-ups; useDrag's own offset
  // resets to zero right after each drag ends, so without folding it into
  // this base position the window would snap back to its cascade spot.
  const [basePosition, setBasePosition] = useState<Position>({ x: 0, y: 0 });
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  // Maximize swaps the CSS-driven default layout for explicit px geometry,
  // animates to the work area, and on restore animates back to the exact box
  // it measured before handing layout back to the CSS defaults.
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [geometryAnimating, setGeometryAnimating] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const restoreGeometryRef = useRef<Geometry | null>(null);
  const pendingGeometryRef = useRef<Geometry | null>(null);
  const geometryTimerRef = useRef<number | undefined>(undefined);

  const maximizedGeometry = (): Geometry => {
    const area = getWorkArea();
    return {
      left: MAXIMIZE_INSET_PX,
      top: area.top + MAXIMIZE_INSET_PX,
      width: area.width - MAXIMIZE_INSET_PX * 2,
      height: area.bottom - area.top - MAXIMIZE_INSET_PX * 2,
    };
  };

  const toggleMaximize = () => {
    window.clearTimeout(geometryTimerRef.current);
    if (!maximized) {
      const current = measure();
      // Mid-restore, the box saved before maximizing is still the right one.
      if (!geometry) restoreGeometryRef.current = current;
      setGeometryAnimating(false);
      setGeometry(current);
      pendingGeometryRef.current = maximizedGeometry();
      setMaximized(true);
    } else {
      setGeometryAnimating(true);
      setGeometry(restoreGeometryRef.current);
      setMaximized(false);
      geometryTimerRef.current = window.setTimeout(() => {
        setGeometryAnimating(false);
        setGeometry(null);
      }, GEOMETRY_ANIMATION_MS + 40);
    }
  };

  // Second half of maximizing: the start box is committed, so flush it and
  // switch to the target with the transition on.
  useLayoutEffect(() => {
    const target = pendingGeometryRef.current;
    if (!target || !wrapperRef.current) return;
    pendingGeometryRef.current = null;
    wrapperRef.current.getBoundingClientRect();
    setGeometryAnimating(true);
    setGeometry(target);
    geometryTimerRef.current = window.setTimeout(
      () => setGeometryAnimating(false),
      GEOMETRY_ANIMATION_MS + 40,
    );
  }, [maximized]);

  useEffect(() => {
    if (!maximized) return;
    const handleResize = () => setGeometry(maximizedGeometry());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => () => window.clearTimeout(geometryTimerRef.current), []);

  const { offset, isDragging, handlers: dragHandlers } = useDrag({
    // A full-screen window still drags (keeping its size); only the
    // maximize/restore animation itself blocks dragging.
    disabled: geometryAnimating,
    onDragStart: () => {
      onFocus();
      const box = measure();
      const area = getWorkArea();
      // Keep enough title bar reachable to grab again, and never above the
      // menu bar. Bounds never pull a window that already sits outside them.
      boundsRef.current = {
        minX: Math.min(0, TITLE_BAR_REACH_PX - box.width - box.left),
        maxX: Math.max(0, area.width - TITLE_BAR_REACH_PX - box.left),
        minY: Math.min(0, area.top - box.top),
        maxY: Math.max(0, area.height - TITLE_BAR_HEIGHT_PX - 8 - box.top),
      };
    },
    clamp: ({ x, y }) => {
      const b = boundsRef.current;
      return { x: Math.min(Math.max(x, b.minX), b.maxX), y: Math.min(Math.max(y, b.minY), b.maxY) };
    },
    onDragEnd: (dragOffset) =>
      geometry
        ? setGeometry({ ...geometry, left: geometry.left + dragOffset.x, top: geometry.top + dragOffset.y })
        : setBasePosition((prev) => ({ x: prev.x + dragOffset.x, y: prev.y + dragOffset.y })),
  });

  // Move keyboard focus in whenever the manager asks (open, restore, reopen).
  useEffect(() => {
    windowRef.current?.focus({ preventScroll: true });
  }, [managed.focusToken]);

  const { phase } = managed;
  const phaseClass =
    phase === 'closing'
      ? styles.animClose
      : phase === 'minimizing'
        ? styles.animMinimize
        : phase === 'minimized'
          ? styles.minimized
          : managed.restored
            ? styles.animRestore
            : styles.animOpen;

  const finishExit = () => {
    const hadFocus = wrapperRef.current?.contains(document.activeElement) ?? false;
    if (phase === 'closing') onFinishClose(hadFocus);
    else if (phase === 'minimizing') onFinishMinimize(hadFocus);
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target === e.currentTarget) finishExit();
  };

  // Safety net: animationend can arrive late or never (background tab, busy
  // main thread), and a window must never get stuck half-closed. The manager
  // ignores whichever of the two finishes second.
  const finishExitRef = useRef(finishExit);
  finishExitRef.current = finishExit;
  useEffect(() => {
    if (phase !== 'closing' && phase !== 'minimizing') return;
    const timer = window.setTimeout(() => finishExitRef.current(), EXIT_ANIMATION_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const positionStyle = geometry
    ? {
        left: geometry.left,
        top: geometry.top,
        width: geometry.width,
        height: geometry.height,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }
    : {
        transform: `translate(calc(-50% + ${step + basePosition.x + offset.x}px), ${step + basePosition.y + offset.y}px)`,
      };

  return (
    <div
      ref={wrapperRef}
      className={`${styles.windowWrapper} ${phaseClass} ${isActive ? '' : styles.inactive} ${geometryAnimating ? styles.geometryAnimating : ''}`}
      style={{ zIndex, ...positionStyle }}
      onPointerDown={onFocus}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        ref={windowRef}
        role="dialog"
        aria-label={item.windowTitle}
        tabIndex={-1}
        data-drop-target={isTrashKind ? 'trash' : undefined}
        className={`${styles.window} ${isImageKind ? styles.windowFixed : ''} ${isAboutKind ? styles.windowAbout : ''} ${isNotesKind ? styles.windowNotes : ''} ${isMailKind ? styles.windowMail : ''} ${isTrashKind ? styles.windowTrash : ''} ${isBrowserKind ? styles.windowBrowser : ''} ${isTextKind ? item.plainText ? styles.windowPlainText : styles.windowTextDoc : ''} ${geometry ? styles.windowFill : ''} ${isTrashKind && trash.dropActive ? styles.windowDropTarget : ''}`}
      >
        <div
          className={`${styles.titleBar} ${isFlushDoc ? styles.titleBarText : ''} ${isDragging ? styles.titleBarDragging : ''}`}
          {...dragHandlers}
        >
          <div className={styles.trafficLights}>
            <button type="button" className={`${styles.light} ${styles.red}`} onClick={onClose} aria-label="Close">
              <svg className={styles.lightIcon} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
                <path
                  d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                  stroke="#4d0000"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.light} ${styles.yellow}`}
              onClick={maximized ? toggleMaximize : undefined}
              disabled={!maximized}
              aria-label="Restore default size"
            >
              <svg className={styles.lightIcon} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
                <path d="M1.5 5H8.5" stroke="#7a4d00" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.light} ${styles.green}`}
              onClick={toggleMaximize}
              aria-label={maximized ? 'Restore' : 'Maximize'}
            >
              <svg className={styles.lightIcon} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
                {maximized ? (
                  <path d="M5.2 1v3.8H9zM4.8 9V5.2H1z" fill="#0a5213" />
                ) : (
                  <path d="M1.5 8.5V4L6 8.5zM8.5 1.5V6L4 1.5z" fill="#0a5213" />
                )}
              </svg>
            </button>
          </div>
          {isFileTitle ? (
            <div className={styles.fileTitleGroup}>
              <span className={styles.fileName}>{item.windowTitle}</span>
            </div>
          ) : !isFlushDoc ? (
            <span className={styles.title}>{item.windowTitle}</span>
          ) : null}
        </div>
        <div
          className={`${styles.content} ${isFlushDoc || isImageKind || isProject || isMailKind || isTrashKind || isBrowserKind ? styles.contentFlush : ''}`}
        >
          <WindowBody item={item} onOpenItem={onOpenItem} />
        </div>
      </div>
      {(isProject || isBrowserKind) && (
        <aside className={`${styles.infoCardFloating} ${geometry ? styles.infoCardHidden : ''}`}>
          {item.tags && (
            <ul className={styles.tags}>
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {item.link && (
            <a className={styles.link} href={item.link.url} target="_blank" rel="noreferrer">
              {item.link.label ?? item.link.url.replace(/^https?:\/\//, '')}
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
          {item.description && <p className={styles.description}>{item.description}</p>}
        </aside>
      )}
    </div>
  );
}
