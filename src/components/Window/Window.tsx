import type { DesktopItem } from '../../data/content';
import { useDrag } from '../../hooks/useDrag';
import styles from './Window.module.css';

interface WindowProps {
  item: DesktopItem;
  zIndex: number;
  cascadeIndex: number;
  onClose: () => void;
  onFocus: () => void;
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

function WindowBody({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case 'image':
      return <ImageOverlayFrame item={item} />;
    case 'text':
    case 'notes':
      return (
        <div className={styles.textPad}>
          {item.textLines?.map((line, i) => (
            <div key={i} className={styles.textLine}>
              {line}
            </div>
          ))}
        </div>
      );
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
      return <div className={styles.placeholder}>Trash is empty</div>;
    case 'project':
      return <MediaFrame item={item} />;
    default:
      return <div className={styles.placeholder}>Screenshot / video placeholder</div>;
  }
}

export function Window({ item, zIndex, cascadeIndex, onClose, onFocus }: WindowProps) {
  const isProject = item.kind === 'project';
  const isImageKind = item.kind === 'image';
  const isAboutKind = item.kind === 'about';
  const isFileTitle = item.kind === 'text' || item.kind === 'notes';
  const isFlushDoc = isFileTitle || item.kind === 'about';
  const step = (cascadeIndex % CASCADE_WRAP) * CASCADE_STEP_PX;
  const { offset, handlers: dragHandlers } = useDrag();

  return (
    <div
      className={`${styles.window} ${isImageKind ? styles.windowFixed : ''} ${isAboutKind ? styles.windowAbout : ''}`}
      style={{
        zIndex,
        transform: `translate(calc(-50% + ${step + offset.x}px), ${step + offset.y}px)`,
      }}
      onPointerDown={onFocus}
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
        className={`${styles.content} ${isFlushDoc || isImageKind || isProject ? styles.contentFlush : ''}`}
      >
        <WindowBody item={item} />
        {isProject && (
          <aside className={styles.infoCardFloating}>
            {item.tags && (
              <ul className={styles.tags}>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
            {item.link && (
              <a
                className={styles.link}
                href={item.link.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.link.label ?? item.link.url.replace(/^https?:\/\//, '')}
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
            {item.description && <p className={styles.description}>{item.description}</p>}
          </aside>
        )}
      </div>
    </div>
  );
}
