import { useState, type FormEvent } from 'react';
import type { DesktopItem } from '../../data/desktopContent';
import {
  isBoldLine,
  isHeading,
  stripBoldMarkers,
  stripHeadingPrefix,
  withHeadingSpacers,
} from '../../data/textBlocks';
import { useDrag, type Position } from '../../hooks/useDrag';
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

interface WindowProps {
  item: DesktopItem;
  zIndex: number;
  cascadeIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onOpenItem: (id: string) => void;
}

const CASCADE_STEP_PX = 28;
const CASCADE_WRAP = 6;

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
          controls
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

function TrashFrame({ item, onOpenItem }: { item: DesktopItem; onOpenItem: (id: string) => void }) {
  const trashItems = item.trashItems ?? [];

  if (trashItems.length === 0) {
    return <div className={styles.trashEmptyState}>Trash is empty</div>;
  }

  return (
    <div className={styles.trashGrid}>
      {trashItems.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={styles.trashItem}
          onClick={() => onOpenItem(entry.id)}
        >
          {entry.iconSrc || entry.posterSrc ? (
            <img
              className={styles.trashThumb}
              src={entry.iconSrc ?? entry.posterSrc}
              alt={entry.label}
            />
          ) : entry.mediaType === 'video' ? (
            <video className={styles.trashThumb} src={entry.mediaSrc} muted preload="metadata" />
          ) : (
            <img className={styles.trashThumb} src={entry.mediaSrc} alt={entry.label} />
          )}
          <span className={styles.trashLabel}>{entry.label}</span>
        </button>
      ))}
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
    case 'text':
      return (
        <div className={styles.textPad}>
          {item.textLines && withHeadingSpacers(item.textLines).map((block, i) => {
            if (typeof block === 'string') {
              if (isHeading(block)) {
                return (
                  <div key={i} className={styles.textHeading}>
                    {stripHeadingPrefix(block)}
                  </div>
                );
              }
              if (i === 0) {
                return (
                  <div key={i} className={styles.textTitle}>
                    {block}
                  </div>
                );
              }
              const bold = isBoldLine(block);
              const text = bold ? stripBoldMarkers(block) : block;
              return (
                <div key={i} className={bold ? `${styles.textLine} ${styles.textLineBold}` : styles.textLine}>
                  {text || ' '}
                </div>
              );
            }
            if ('images' in block) {
              return (
                <div key={i} className={styles.textImageRow}>
                  {block.images.map((src) => (
                    <img key={src} className={styles.textImage} src={src} alt="" />
                  ))}
                </div>
              );
            }
            if ('image' in block) {
              return (
                <img
                  key={i}
                  className={styles.textImageFull}
                  src={block.image}
                  alt={block.alt ?? ''}
                />
              );
            }
            if ('openId' in block) {
              return (
                <button
                  key={i}
                  type="button"
                  className={styles.textLink}
                  onClick={() => onOpenItem(block.openId)}
                >
                  {block.label}
                  <span aria-hidden="true"> ↗</span>
                </button>
              );
            }
            return (
              <a
                key={i}
                className={styles.textLink}
                href={block.href}
                target="_blank"
                rel="noreferrer"
              >
                {block.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            );
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
      return <TrashFrame item={item} onOpenItem={onOpenItem} />;
    case 'browser':
      return <BrowserFrame item={item} />;
    case 'project':
      return <MediaFrame item={item} />;
    default:
      return <div className={styles.placeholder}>Screenshot / video placeholder</div>;
  }
}

export function Window({ item, zIndex, cascadeIndex, onClose, onFocus, onOpenItem }: WindowProps) {
  const isProject = item.kind === 'project';
  const isImageKind = item.kind === 'image';
  const isAboutKind = item.kind === 'about';
  const isNotesKind = item.kind === 'notes';
  const isMailKind = item.kind === 'mail';
  const isTrashKind = item.kind === 'trash';
  const isBrowserKind = item.kind === 'browser';
  const isFileTitle = item.kind === 'text' || item.kind === 'notes';
  const isFlushDoc = isFileTitle || item.kind === 'about';
  const step = (cascadeIndex % CASCADE_WRAP) * CASCADE_STEP_PX;
  // Drag distance persists here across pointer-ups; useDrag's own offset
  // resets to zero right after each drag ends, so without folding it into
  // this base position the window would snap back to its cascade spot.
  const [basePosition, setBasePosition] = useState<Position>({ x: 0, y: 0 });
  const handleDragEnd = (dragOffset: Position) => {
    setBasePosition((prev) => ({ x: prev.x + dragOffset.x, y: prev.y + dragOffset.y }));
  };
  const { offset, handlers: dragHandlers } = useDrag(undefined, handleDragEnd);

  return (
    <div
      className={styles.windowWrapper}
      style={{
        zIndex,
        transform: `translate(calc(-50% + ${step + basePosition.x + offset.x}px), ${step + basePosition.y + offset.y}px)`,
      }}
      onPointerDown={onFocus}
    >
      <div
        className={`${styles.window} ${isImageKind ? styles.windowFixed : ''} ${isAboutKind ? styles.windowAbout : ''} ${isNotesKind ? styles.windowNotes : ''} ${isMailKind ? styles.windowMail : ''} ${isTrashKind ? styles.windowTrash : ''} ${isBrowserKind ? styles.windowBrowser : ''}`}
      >
        <div
          className={`${styles.titleBar} ${isFlushDoc ? styles.titleBarText : ''}`}
          {...dragHandlers}
        >
          <div
            className={styles.trafficLights}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`${styles.light} ${styles.red}`}
              onClick={onClose}
              aria-label="Close window"
            >
              <svg className={styles.closeIcon} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
                <path
                  d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                  stroke="#4d0000"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <span className={`${styles.light} ${styles.yellow}`} aria-hidden="true" />
            <span className={`${styles.light} ${styles.green}`} aria-hidden="true" />
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
        <aside className={styles.infoCardFloating}>
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
