import { PlainTextDoc } from '../PlainTextDoc/PlainTextDoc';
import { MarkdownDoc } from '../CaseStudy/MarkdownDoc';
import { ConceptDiagram } from '../CaseStudy/ConceptDiagram';
import { Fragment, useRef, useState, type FormEvent } from 'react';
import {
  aboutInfo,
  contactInfo,
  gridApps,
  notesInfo,
  trashItems,
  type MobileAppItem,
} from '../../data/mobileContent';
import {
  layoutTextDoc,
  parseInline,
  type FlowDiagramData,
  type SplitMediaSection,
  type TextTier,
} from '../../data/textBlocks';
import styles from './Mobile.module.css';
import { dockLinks } from '../../data/desktopContent';

const DOCK_ICONS = {
  about: '/icons/about-me.png',
  notes: '/icons/notes.png',
  mail: '/icons/mail.png',
  github: '/icons/github.png',
};

type OverlayId = string | 'about' | 'notes' | 'mail';

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 12 20" width="10" height="16" fill="none">
      <path d="M10 2L2 10l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89M13.5 2v3.5H10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppIcon({
  app,
  isPlaying,
  onOpen,
}: {
  app: MobileAppItem;
  isPlaying?: boolean;
  onOpen: () => void;
}) {
  const glyphClass = `${styles.appGlyph} ${
    app.iconFit === 'cover'
      ? styles.appGlyphCover
      : app.iconBg === 'white'
        ? styles.appGlyphOnWhite
        : app.iconBg === 'grey'
          ? styles.appGlyphOnGrey
          : ''
  }`;

  if (app.kind === 'link' && app.href) {
    return (
      <a className={styles.appIcon} href={app.href} target="_blank" rel="noreferrer">
        <span className={styles.appGlyphWrapper}>
          <img className={glyphClass} src={app.iconSrc} alt="" />
          <span className={styles.linkBadge} aria-hidden="true">
            <svg viewBox="0 0 10 10" width="8" height="8">
              <path
                d="M2.5 7.5L7.5 2.5M7.5 2.5H3.5M7.5 2.5V6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        <span className={styles.appLabel}>{app.label}</span>
      </a>
    );
  }

  return (
    <button type="button" className={styles.appIcon} onClick={onOpen}>
      <span className={styles.appGlyphWrapper}>
        <img className={glyphClass} src={app.iconSrc} alt="" />
        {app.kind === 'audio' && (
          <span className={styles.playBadge} aria-hidden="true">
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" />
              </svg>
            )}
          </span>
        )}
      </span>
      <span className={styles.appLabel}>{app.label}</span>
    </button>
  );
}

// Full-bleed Safari-style chrome: a live iframe (embedUrl) or a screen
// recording/screenshot standing in for one (mediaSrc), with the address bar
// and its controls docked at the bottom like iOS Safari.
function SiteFrame({ app, onBack }: { app: MobileAppItem; onBack: () => void }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const displayUrl = app.link ? app.link.url.replace(/^https?:\/\//, '') : app.label;
  const hasInfo = Boolean(app.tags || app.description || app.link);

  return (
    <div className={styles.siteFrame}>
      <div className={styles.siteContent}>
        {app.embedUrl ? (
          <iframe key={reloadKey} className={styles.siteIframe} src={app.embedUrl} title={app.label} />
        ) : app.mediaSrc ? (
          app.mediaType === 'video' ? (
            <video
              key={reloadKey}
              className={styles.siteMediaVideo}
              src={app.mediaSrc}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img className={styles.siteMedia} src={app.mediaSrc} alt={app.label} />
          )
        ) : (
          <div className={styles.sitePlaceholder}>preview coming soon</div>
        )}
      </div>

      <div className={styles.siteCornerActions}>
        {hasInfo && (
          <button
            type="button"
            className={styles.siteInfoToggle}
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Info"
          >
            info
          </button>
        )}
        <button type="button" className={styles.siteCloseBtn} onClick={onBack} aria-label="Close">
          ✕
        </button>
      </div>

      {showInfo && hasInfo && (
        <aside className={styles.siteInfoBox}>
          {app.tags && (
            <ul className={styles.siteInfoTags}>
              {app.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {app.description && <p className={styles.siteInfoDescription}>{app.description}</p>}
          {app.link && (
            <a
              className={styles.siteInfoLink}
              href={app.link.url}
              target="_blank"
              rel="noreferrer"
            >
              {displayUrl}
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </aside>
      )}

      <div className={styles.siteToolbar}>
        <button type="button" className={styles.siteToolbarBtn} onClick={onBack} aria-label="Back">
          <ChevronLeftIcon />
        </button>
        <span className={styles.siteUrlPill}>{displayUrl}</span>
        <button
          type="button"
          className={styles.siteToolbarBtn}
          onClick={() => setReloadKey((k) => k + 1)}
          aria-label="Reload"
        >
          <ReloadIcon />
        </button>
      </div>
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

// Reusable text+visual split section — mobile always stacks text first
// regardless of the desktop `orientation`, since there's no room for a
// real side-by-side split on a phone. The visual falls back to a
// same-size placeholder if its file 404s.
function SplitSectionBlock({ data }: { data: SplitMediaSection }) {
  return (
    <div className={styles.splitSection}>
      <div className={styles.splitText}>
        {data.eyebrow && <div className={styles.splitEyebrow}>{data.eyebrow}</div>}
        {data.body.map((paragraph, pi) => (
          <p key={pi} className={styles.splitBody}>
            {paragraph}
          </p>
        ))}
        {data.statement && <p className={styles.splitStatement}>{data.statement}</p>}
      </div>
      <div className={styles.splitVisual}>
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

// Restrained node/connector diagram — same as desktop's, always stacks
// (mobile has no side-by-side room), no fills beyond white, no gradients.
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
              padding: `${7 + si * 3}px ${14 + si * 6}px`,
              fontSize: `${12 + si * 2}px`,
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

function TextDoc({
  app,
  onClose,
  onOpenApp,
}: {
  app: MobileAppItem;
  onClose: () => void;
  onOpenApp: (id: string) => void;
}) {
  return (
    <div className={`${styles.docOverlay} ${app.plainText ? styles.plainTextOverlay : ''}`}>
      <div className={styles.docHeader}>
        <span className={styles.docTitle}>{app.label}</span>
        <button type="button" className={styles.docClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className={app.caseStudyId || app.plainText ? `${styles.docScroll} ${styles.editorialScroll}` : styles.docScroll}>
        {app.plainText ? <PlainTextDoc lines={app.plainText} /> : app.caseStudyId ? <MarkdownDoc caseStudyId={app.caseStudyId} onOpenItem={onOpenApp} /> : <div className={styles.textPad}>
          {app.textLines &&
            layoutTextDoc(app.textLines).map((entry, i) => {
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
                      onClick={() => onOpenApp(entry.openId)}
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
        </div>}
      </div>
    </div>
  );
}

function ImageDoc({ app, onClose }: { app: MobileAppItem; onClose: () => void }) {
  if (app.overlayFill) {
    return (
      <div className={styles.docOverlay}>
        <img className={styles.docImageFill} src={app.mediaSrc} alt={app.label} />
        <button
          type="button"
          className={styles.docCloseFloating}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={styles.docOverlay}>
      <div className={styles.docHeader}>
        <span className={styles.docTitle}>{app.label}</span>
        <button type="button" className={styles.docClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className={styles.docScroll}>
        <img className={styles.docImage} src={app.mediaSrc} alt={app.label} />
      </div>
    </div>
  );
}

function TrashFolder({ onClose }: { onClose: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = trashItems.find((item) => item.id === selectedId);

  if (selected && selected.kind === 'site') {
    return <SiteFrame app={selected} onBack={() => setSelectedId(null)} />;
  }
  if (selected && selected.kind === 'image') {
    return <ImageDoc app={selected} onClose={() => setSelectedId(null)} />;
  }

  return (
    <div className={styles.docOverlay}>
      <div className={styles.docHeader}>
        <span className={styles.docTitle}>Trash</span>
        <button type="button" className={styles.docClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className={styles.docScroll}>
        <div className={styles.trashGrid}>
          {trashItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.trashItem}
              onClick={() => setSelectedId(item.id)}
            >
              <img className={styles.trashItemIcon} src={item.iconSrc} alt="" />
              <span className={styles.trashItemLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayHeader}>
        <button type="button" className={styles.overlayClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <span className={styles.overlayTitle}>About Me</span>
      </div>
      <div className={styles.overlayScroll}>
        <div className={styles.overlayBody}>
          <img className={styles.aboutPhoto} src={aboutInfo.photoSrc} alt={aboutInfo.name} />
          <h2 className={styles.aboutName}>{aboutInfo.name}</h2>
          <p className={styles.aboutRole}>{aboutInfo.role}</p>
          <a className={styles.overlayLink} href={`mailto:${aboutInfo.mail}`}>
            {aboutInfo.mail}
          </a>
          {aboutInfo.bioParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.overlayDescription}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const HEADING_PREFIX = '## ';

function stripHeadingPrefix(paragraph: string): string {
  return paragraph.startsWith(HEADING_PREFIX) ? paragraph.slice(HEADING_PREFIX.length) : paragraph;
}

function NotesApp({ onClose }: { onClose: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = notesInfo.find((n) => n.id === selectedId);

  if (selected) {
    return (
      <div className={styles.notesPage}>
        <button type="button" className={styles.notesCloseBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className={styles.notesDetailScroll}>
          <button
            type="button"
            className={styles.notesBackLink}
            onClick={() => setSelectedId(null)}
          >
            ‹ Notes
          </button>
          <p className={styles.notesDetailTitleLine}>{selected.title}</p>
          {selected.paragraphs.map((paragraph, i) =>
            paragraph.startsWith(HEADING_PREFIX) ? (
              <p key={i} className={styles.notesSubheading}>
                {stripHeadingPrefix(paragraph)}
              </p>
            ) : (
              <p key={i} className={styles.overlayDescription}>
                {paragraph}
              </p>
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notesPage}>
      <button type="button" className={styles.notesCloseBtn} onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className={styles.notesListScroll}>
        <h1 className={styles.notesListTitle}>Notes</h1>
        <p className={styles.notesListCount}>{notesInfo.length} Notes</p>
        <div className={styles.notesListCard}>
          {notesInfo.map((note, i) => {
            const preview = stripHeadingPrefix(note.paragraphs[0]);
            return (
              <button
                key={note.id}
                type="button"
                className={styles.notesListRow}
                onClick={() => setSelectedId(note.id)}
                style={i === notesInfo.length - 1 ? { borderBottom: 'none' } : undefined}
              >
                <span className={styles.notesListRowTitle}>{note.title}</span>
                <span className={styles.notesListRowMeta}>
                  {note.date} {preview.slice(0, 34)}
                  {preview.length > 34 ? '…' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

function MailSheet({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch(contactInfo.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      if (response.ok) {
        setStatus('sent');
        e.currentTarget.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.sheetBackdrop}>
      <div className={styles.mailSheet}>
        <div className={styles.sheetHandle} />
        <div className={styles.mailSheetHeader}>
          <button type="button" className={styles.sheetIconBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
          <button
            type="submit"
            form="mobile-mail-form"
            className={styles.sheetSendBtn}
            disabled={status === 'sending'}
            aria-label="Send"
          >
            ↑
          </button>
        </div>
        <h2 className={styles.mailSheetTitle}>New Message</h2>
        <form id="mobile-mail-form" className={styles.mailFields} onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value={contactInfo.mailSubject} />
          <div className={styles.mailFieldRow}>
            <span className={styles.mailFieldLabel}>To:</span>
            <span>{contactInfo.mailTo}</span>
          </div>
          <div className={styles.mailFieldRow}>
            <span className={styles.mailFieldLabel}>Name:</span>
            <input className={styles.mailFieldInput} name="name" required />
          </div>
          <div className={styles.mailFieldRow}>
            <span className={styles.mailFieldLabel}>From:</span>
            <input className={styles.mailFieldInput} name="email" type="email" required />
          </div>
          <div className={styles.mailFieldRow}>
            <span className={styles.mailFieldLabel}>Subject:</span>
            <span>{contactInfo.mailSubject}</span>
          </div>
          <textarea
            className={styles.mailBody}
            name="message"
            placeholder="hi theresa, ..."
            required
          />
        </form>
        {status === 'sent' && <p className={styles.mailStatus}>sent ✓</p>}
        {status === 'error' && (
          <p className={styles.mailStatusError}>
            something went wrong — email {contactInfo.mailTo} directly.
          </p>
        )}
      </div>
    </div>
  );
}

export function Mobile() {
  const [openId, setOpenId] = useState<OverlayId | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioApp = gridApps.find((app) => app.kind === 'audio');

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const openApp = gridApps.find((app) => app.id === openId);

  return (
    <div className={styles.phone}>
      <div className={styles.grid}>
        {gridApps.map((app) => (
          <Fragment key={app.id}>
            {app.id === 'wrestling-octopi' && (
              <div className={styles.sectionGap} aria-hidden="true" />
            )}
            <AppIcon
              app={app}
              isPlaying={app.kind === 'audio' ? isAudioPlaying : undefined}
              onOpen={() => (app.kind === 'audio' ? toggleAudio() : setOpenId(app.id))}
            />
          </Fragment>
        ))}
      </div>
      {audioApp && (
        <audio
          ref={audioRef}
          src={audioApp.audioSrc}
          onPlay={() => setIsAudioPlaying(true)}
          onPause={() => setIsAudioPlaying(false)}
          onEnded={() => setIsAudioPlaying(false)}
        />
      )}

      <nav className={styles.dock} aria-label="Dock">
        <button type="button" className={styles.dockItem} onClick={() => setOpenId('about')}>
          <img className={`${styles.dockGlyph} ${styles.rounded}`} src={DOCK_ICONS.about} alt="" />
        </button>
        <button type="button" className={styles.dockItem} onClick={() => setOpenId('notes')}>
          <img className={styles.dockGlyph} src={DOCK_ICONS.notes} alt="" />
        </button>
        <button type="button" className={styles.dockItem} onClick={() => setOpenId('mail')}>
          <img className={styles.dockGlyph} src={DOCK_ICONS.mail} alt="" />
        </button>
        <a className={styles.dockItem} href={dockLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <img className={`${styles.dockGlyph} ${styles.rounded}`} src={DOCK_ICONS.github} alt="" />
          <span className={styles.linkBadge} aria-hidden="true">
            <svg viewBox="0 0 10 10" width="8" height="8">
              <path d="M2.5 7.5L7.5 2.5M7.5 2.5H3.5M7.5 2.5V6.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </nav>

      {openId === 'about' && <AboutOverlay onClose={() => setOpenId(null)} />}
      {openId === 'notes' && <NotesApp onClose={() => setOpenId(null)} />}
      {openId === 'mail' && <MailSheet onClose={() => setOpenId(null)} />}
      {openApp && openApp.kind === 'site' && (
        <SiteFrame app={openApp} onBack={() => setOpenId(null)} />
      )}
      {openApp && (openApp.kind === 'text' || openApp.kind === 'markdown') && (
        <TextDoc app={openApp} onClose={() => setOpenId(null)} onOpenApp={(id) => setOpenId(id)} />
      )}
      {openApp && openApp.kind === 'image' && (
        <ImageDoc app={openApp} onClose={() => setOpenId(null)} />
      )}
      {openApp && openApp.kind === 'trash' && (
        <TrashFolder onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
