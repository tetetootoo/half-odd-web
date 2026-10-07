import { useState } from 'react';
import { useDrag, type Position } from '../../hooks/useDrag';
import { capitalizeLabel } from './capitalizeLabel';
import styles from './DesktopIcon.module.css';

interface PlaybackControl {
  isPlaying: boolean;
}

interface DesktopIconProps {
  label: string;
  preserveLabelCase?: boolean;
  ariaLabel: string;
  xPercent: number;
  yPercent: number;
  iconSrc?: string;
  imagePreview?: boolean;
  href?: string;
  selected: boolean;
  exiting?: boolean;
  restored?: boolean;
  onSelect: () => void;
  onActivate?: (opener: HTMLElement) => void;
  onDragMove: (pointer: Position) => void;
  onDragCancel: () => void;
  onDrop: (offset: Position, pointer: Position) => void;
  onTrash?: () => void;
  // A drag is currently over a Trash drop target.
  overTrash?: boolean;
  playback?: PlaybackControl;
  showLinkBadge?: boolean;
}

function IconFace({
  label,
  preserveLabelCase,
  iconSrc,
  playback,
  showLinkBadge,
}: Pick<DesktopIconProps, 'label' | 'preserveLabelCase' | 'iconSrc' | 'playback' | 'showLinkBadge'>) {
  return (
    <>
      <span className={styles.glyphWrapper}>
        {iconSrc ? (
          <img className={styles.glyphImage} src={iconSrc} alt="" draggable={false} />
        ) : (
          <span className={styles.glyph} aria-hidden="true" />
        )}
        {playback && (
          <span className={styles.playBadge} aria-hidden="true">
            {playback.isPlaying ? (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" />
              </svg>
            )}
          </span>
        )}
        {showLinkBadge && (
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
        )}
      </span>
      <span className={styles.label}>{preserveLabelCase ? label : capitalizeLabel(label)}</span>
    </>
  );
}

// Single click selects, double click opens (Enter/Space open from the
// keyboard); a press that moves past the drag threshold moves the icon
// instead (or drops it in the Trash).
export function DesktopIcon({
  label,
  preserveLabelCase,
  ariaLabel,
  xPercent,
  yPercent,
  iconSrc,
  imagePreview,
  href,
  selected,
  exiting,
  restored,
  onSelect,
  onActivate,
  onDragMove,
  onDrop,
  onDragCancel,
  onTrash,
  overTrash,
  playback,
  showLinkBadge,
}: DesktopIconProps) {
  const [dropOffset, setDropOffset] = useState<Position>({ x: 0, y: 0 });
  const { offset, isDragging, handlers } = useDrag({
    onDragStart: onSelect,
    onDragCancel,
    onDragMove: (_offset, e) => onDragMove({ x: e.clientX, y: e.clientY }),
    onDragEnd: (dragOffset, e) => {
      if (overTrash) setDropOffset(dragOffset);
      onDrop(dragOffset, { x: e.clientX, y: e.clientY });
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onSelect();
    // A link's own navigation would open on the first click; opening is
    // left to the double click (or the keyboard) like every other icon.
    if (href) e.preventDefault();
    // detail is 0 for clicks synthesized by Enter/Space.
    if (e.detail === 0) onActivate?.(e.currentTarget);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => onActivate?.(e.currentTarget);

  // Keyboard path to the Trash, so dragging is never the only way.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (href && e.key === ' ') {
      e.preventDefault();
      onSelect();
      onActivate?.(e.currentTarget as HTMLElement);
      return;
    }
    if (!onTrash) return;
    if (e.key === 'Delete' || (e.key === 'Backspace' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      onTrash();
    }
  };

  const className = `${exiting ? styles.exiting : restored ? styles.restored : ''} ${styles.icon} ${imagePreview ? styles.imagePreview : ''} ${selected ? styles.selected : ''} ${isDragging ? styles.dragging : ''} ${isDragging && overTrash ? styles.overTrash : ''}`;
  const style = {
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    translate: `${offset.x + (exiting ? dropOffset.x : 0)}px ${offset.y + (exiting ? dropOffset.y : 0)}px`,
  };
  const face = <IconFace label={label} preserveLabelCase={preserveLabelCase} iconSrc={iconSrc} playback={playback} showLinkBadge={showLinkBadge} />;

  if (href) {
    return (
      <a
        className={className}
        style={style}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        draggable={false}
        data-dragging-icon={isDragging || undefined}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        {...handlers}
      >
        {face}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={ariaLabel}
      data-dragging-icon={isDragging || undefined}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      {...handlers}
    >
      {face}
    </button>
  );
}

// Non-interactive stand-in that follows the pointer while an item is
// dragged out of the Trash window onto the desktop.
export function DesktopIconGhost({ label, preserveLabelCase, iconSrc, imagePreview, left, top }: { label: string; preserveLabelCase?: boolean; iconSrc?: string; imagePreview?: boolean; left: number; top: number }) {
  return (
    <div className={`${styles.icon} ${imagePreview ? styles.imagePreview : ''} ${styles.selected} ${styles.ghost}`} style={{ left, top }} aria-hidden="true">
      <IconFace label={label} preserveLabelCase={preserveLabelCase} iconSrc={iconSrc} />
    </div>
  );
}
