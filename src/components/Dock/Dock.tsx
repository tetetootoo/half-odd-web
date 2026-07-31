import { dockLinks } from '../../data/desktopContent';
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

function ExternalLinkBadge() {
  return (
    <span className={styles.externalBadge} aria-hidden="true">
      <svg viewBox="0 0 10 10" width="7" height="7">
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
        <ExternalLinkBadge />
        <Tooltip label="Instagram" />
      </a>
      <a className={styles.item} href={dockLinks.github} target="_blank" rel="noreferrer">
        <img className={`${styles.glyphImage} ${styles.rounded}`} src={icons.github} alt="" />
        <ExternalLinkBadge />
        <Tooltip label="GitHub" />
      </a>
      <button type="button" className={styles.item} onClick={onOpenTrash}>
        <img className={`${styles.glyphImage} ${styles.trashGlyph}`} src={icons.trash} alt="" />
        <Tooltip label="Trash" />
      </button>
    </nav>
  );
}
