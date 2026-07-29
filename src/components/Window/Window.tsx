import type { DesktopItem } from '../../data/content';
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

function WindowBody({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case 'image':
      return <div className={styles.placeholder}>Image / video placeholder</div>;
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
    case 'browser':
      return (
        <div className={styles.browser}>
          <div className={styles.addressBar}>{item.link?.url}</div>
          <div className={styles.placeholder}>Browser placeholder</div>
        </div>
      );
    case 'project':
    default:
      return <div className={styles.placeholder}>Screenshot / video placeholder</div>;
  }
}

export function Window({ item, zIndex, cascadeIndex, onClose, onFocus }: WindowProps) {
  const isProject = item.kind === 'project';
  const isFileTitle = item.kind === 'text' || item.kind === 'notes';
  const isFlushDoc = isFileTitle || item.kind === 'about';
  const step = (cascadeIndex % CASCADE_WRAP) * CASCADE_STEP_PX;

  return (
    <div
      className={styles.window}
      style={{ zIndex, transform: `translate(calc(-50% + ${step}px), ${step}px)` }}
      onPointerDown={onFocus}
    >
      <div className={`${styles.titleBar} ${isFlushDoc ? styles.titleBarText : ''}`}>
        <div className={styles.trafficLights}>
          <button
            type="button"
            className={`${styles.light} ${styles.red}`}
            onClick={onClose}
            aria-label="Close window"
          />
          <span className={`${styles.light} ${styles.yellow}`} aria-hidden="true" />
          <span className={`${styles.light} ${styles.green}`} aria-hidden="true" />
        </div>
        {isFileTitle ? (
          <div className={styles.fileTitleGroup}>
            {item.iconSrc && <img className={styles.fileIcon} src={item.iconSrc} alt="" />}
            <span className={styles.fileName}>{item.windowTitle}</span>
          </div>
        ) : !isFlushDoc ? (
          <span className={styles.title}>{item.windowTitle}</span>
        ) : null}
      </div>
      <div className={`${styles.content} ${isFlushDoc ? styles.contentFlush : ''}`}>
        <WindowBody item={item} />
        {isProject && (
          <aside className={styles.infoCard}>
            <h3 className={styles.infoTitle}>{item.label}</h3>
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
