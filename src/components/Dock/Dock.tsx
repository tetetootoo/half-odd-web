import { type Ref } from 'react';
import { useDockMotion } from '../../hooks/useDockMotion';
import { dockLinks, type DesktopItem } from '../../data/desktopContent';
import styles from './Dock.module.css';

const icons = {
  aboutMe: '/icons/about-me.png',
  notes: '/icons/notes.png',
  mail: '/icons/mail.png',
  linkedin: '/icons/linkedin.jpg',
  instagram: '/icons/instagram.png',
  github: '/icons/github.png',
  trash: '/icons/trash.png',
};

interface DockProps {
  ref?: Ref<HTMLElement>;
  // Windows that are logically open (visible or minimized).
  runningIds: Set<string>;
  // Minimized windows with no permanent dock item of their own.
  minimizedItems: DesktopItem[];
  trashCount: number;
  trashDropActive: boolean;
  onOpenWindow: (id: string, opener: HTMLElement) => void;
  onRestore: (id: string) => void;
}

interface DockEntry {
  key: string;
  label: string;
  ariaLabel?: string;
  iconSrc: string;
  iconClass?: string;
  href?: string;
  windowId?: string;
  onClick?: (el: HTMLElement) => void;
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className={styles.tooltip} aria-hidden="true">
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

export function Dock({
  ref,
  runningIds,
  minimizedItems,
  trashCount,
  trashDropActive,
  onOpenWindow,
  onRestore,
}: DockProps) {
  const motion = useDockMotion();

  const permanent: DockEntry[] = [
    { key: 'about-me', label: 'About Me', iconSrc: icons.aboutMe, iconClass: styles.rounded, windowId: 'about-me' },
    { key: 'notes', label: 'Notes', iconSrc: icons.notes, windowId: 'notes' },
    { key: 'mail', label: 'Mail', iconSrc: icons.mail, windowId: 'mail' },
    { key: 'linkedin', label: 'LinkedIn', iconSrc: icons.linkedin, href: dockLinks.linkedin },
    { key: 'instagram', label: 'Instagram', iconSrc: icons.instagram, href: dockLinks.instagram },
    { key: 'github', label: 'GitHub', iconSrc: icons.github, iconClass: styles.rounded, href: dockLinks.github },
  ];
  const minimized: DockEntry[] = minimizedItems.map((item) => ({
    key: `minimized-${item.id}`,
    label: item.label,
    ariaLabel: `Restore ${item.label}`,
    iconSrc: (item.kind === 'audio' ? item.posterSrc : item.iconSrc) ?? '',
    iconClass: styles.minimizedGlyph,
    onClick: () => onRestore(item.id),
  }));
  const trash: DockEntry = {
    key: 'trash',
    label: 'Trash',
    ariaLabel: trashCount > 0 ? `Trash, ${trashCount} item${trashCount === 1 ? '' : 's'}` : 'Trash, empty',
    iconSrc: icons.trash,
    iconClass: styles.trashGlyph,
    windowId: 'trash',
  };

  const renderEntry = (entry: DockEntry) => {
    const isTrash = entry.key === 'trash';
    const running = entry.windowId !== undefined && runningIds.has(entry.windowId);
    const className = `${styles.item} ${isTrash && trashDropActive ? styles.dropTarget : ''}`;
    const common = {
      className,
      'aria-label': entry.ariaLabel ?? entry.label,
      'data-drop-target': isTrash ? 'trash' : undefined,
    };
    const face = (
      <>
        <span className={`${styles.magnify} ${entry.key === 'linkedin' ? styles.linkedin : ''}`} data-dock-face="">
          <img className={`${styles.glyphImage} ${entry.iconClass ?? ''}`} src={entry.iconSrc} alt="" draggable={false} />
          {entry.href && <ExternalLinkBadge />}
        </span>
        <Tooltip label={entry.label} />
        {running && <span className={styles.runningDot} aria-hidden="true" />}
      </>
    );

    if (entry.href) {
      return (
        <a key={entry.key} {...common} href={entry.href} target="_blank" rel="noopener noreferrer">
          {face}
        </a>
      );
    }
    return (
      <button
        key={entry.key}
        type="button"
        {...common}
        onClick={(e) => (entry.onClick ? entry.onClick(e.currentTarget) : onOpenWindow(entry.windowId!, e.currentTarget))}
      >
        {face}
      </button>
    );
  };

  return (
    <nav ref={(element) => { motion.host.current = element; if (typeof ref === 'function') return ref(element); else if (ref) ref.current = element; }} className={styles.dock} aria-label="Dock" onPointerMove={motion.onPointerMove} onPointerLeave={motion.onPointerLeave}>
      {permanent.map(renderEntry)}
      {minimized.length > 0 && <span className={styles.divider} aria-hidden="true" />}
      {minimized.map(renderEntry)}
      {renderEntry(trash)}
    </nav>
  );
}
