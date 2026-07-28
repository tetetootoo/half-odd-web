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
        <ul className={styles.textList}>
          {item.textLines?.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      );
    case 'about':
      return (
        <div className={styles.about}>
          <div className={styles.avatarPlaceholder} />
          <p>{item.description}</p>
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
  const step = (cascadeIndex % CASCADE_WRAP) * CASCADE_STEP_PX;

  return (
    <div
      className={styles.window}
      style={{ zIndex, transform: `translate(calc(-50% + ${step}px), ${step}px)` }}
      onPointerDown={onFocus}
    >
      <div className={styles.titleBar}>
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
        <span className={styles.title}>{item.windowTitle}</span>
      </div>
      <div className={styles.content}>
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
