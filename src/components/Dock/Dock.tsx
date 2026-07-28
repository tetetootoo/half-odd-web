import { dockLinks } from '../../data/content';
import styles from './Dock.module.css';

const icons = {
  mail: '/icons/mail.png',
  safari: '/icons/safari.png',
  github: '/icons/github.jpg',
  trash: '/icons/trash.png',
};

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
        <img className={styles.glyphImage} src={icons.safari} alt="" />
      </button>
      <a className={styles.item} href={dockLinks.mail} title="Mail">
        <img className={styles.glyphImage} src={icons.mail} alt="" />
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
        <img className={`${styles.glyphImage} ${styles.rounded}`} src={icons.github} alt="" />
      </a>
      <button type="button" className={styles.item} onClick={onOpenTrash} title="Trash">
        <img className={styles.glyphImage} src={icons.trash} alt="" />
      </button>
    </nav>
  );
}
