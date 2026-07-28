import { dockLinks } from '../../data/content';
import styles from './Dock.module.css';

interface DockProps {
  onOpenAboutMe: () => void;
  onOpenNotes: () => void;
  onOpenSafari: () => void;
  onOpenTrash: () => void;
}

export function Dock({ onOpenAboutMe, onOpenNotes, onOpenSafari, onOpenTrash }: DockProps) {
  return (
    <nav className={styles.dock} aria-label="Dock">
      <button type="button" className={styles.item} onClick={onOpenAboutMe} title="About Me">
        <span className={`${styles.glyph} ${styles.profile}`} aria-hidden="true" />
      </button>
      <button type="button" className={styles.item} onClick={onOpenNotes} title="Notes">
        <span className={styles.glyph} aria-hidden="true" />
      </button>
      <button type="button" className={styles.item} onClick={onOpenSafari} title="Safari">
        <span className={styles.glyph} aria-hidden="true" />
      </button>
      <a
        className={styles.item}
        href={dockLinks.mail}
        title="Mail"
      >
        <span className={styles.glyph} aria-hidden="true" />
      </a>
      <a
        className={styles.item}
        href={dockLinks.instagram}
        target="_blank"
        rel="noreferrer"
        title="Instagram"
      >
        <span className={styles.glyph} aria-hidden="true" />
      </a>
      <a
        className={styles.item}
        href={dockLinks.github}
        target="_blank"
        rel="noreferrer"
        title="GitHub"
      >
        <span className={styles.glyph} aria-hidden="true" />
      </a>
      <button type="button" className={styles.item} onClick={onOpenTrash} title="Trash">
        <span className={styles.glyph} aria-hidden="true" />
      </button>
    </nav>
  );
}
