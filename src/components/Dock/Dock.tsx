import { dockLinks } from '../../data/content';
import styles from './Dock.module.css';

const icons = {
  aboutMe: '/icons/memoji.png',
  notes: '/icons/notes.png',
  mail: '/icons/mail.png',
  instagram: '/icons/instagram.png',
  github: '/icons/github.png',
  trash: '/icons/trash.png',
};

interface DockProps {
  onOpenAboutMe: () => void;
  onOpenNotes: () => void;
  onOpenMail: () => void;
  onOpenTrash: () => void;
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className={styles.tooltip} role="tooltip">
      {label}
    </span>
  );
}

export function Dock({ onOpenAboutMe, onOpenNotes, onOpenMail, onOpenTrash }: DockProps) {
  return (
    <nav className={styles.dock} aria-label="Dock">
      <button type="button" className={styles.item} onClick={onOpenAboutMe}>
        <img className={`${styles.glyphImage} ${styles.rounded}`} src={icons.aboutMe} alt="" />
        <Tooltip label="About Me" />
      </button>
      <button type="button" className={styles.item} onClick={onOpenNotes}>
        <img className={styles.glyphImage} src={icons.notes} alt="" />
        <Tooltip label="Notes" />
      </button>
      <button type="button" className={styles.item} onClick={onOpenMail}>
        <img className={styles.glyphImage} src={icons.mail} alt="" />
        <Tooltip label="Mail" />
      </button>
      <a className={styles.item} href={dockLinks.instagram} target="_blank" rel="noreferrer">
        <img className={styles.glyphImage} src={icons.instagram} alt="" />
        <Tooltip label="Instagram" />
      </a>
      <a className={styles.item} href={dockLinks.github} target="_blank" rel="noreferrer">
        <img className={`${styles.glyphImage} ${styles.rounded}`} src={icons.github} alt="" />
        <Tooltip label="GitHub" />
      </a>
      <button type="button" className={styles.item} onClick={onOpenTrash}>
        <img className={styles.glyphImage} src={icons.trash} alt="" />
        <Tooltip label="Trash" />
      </button>
    </nav>
  );
}
