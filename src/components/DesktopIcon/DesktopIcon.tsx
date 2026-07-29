import { useDrag } from '../../hooks/useDrag';
import styles from './DesktopIcon.module.css';

interface PlaybackControl {
  isPlaying: boolean;
  onToggle: () => void;
}

interface DesktopIconProps {
  label: string;
  xPercent: number;
  yPercent: number;
  iconSrc?: string;
  onOpen?: () => void;
  playback?: PlaybackControl;
}

// Capitalizes each space-separated word but leaves anything from a "."
// onward untouched, so file suffixes like ".txt" or ".jpg" stay lowercase
// instead of CSS text-transform treating them as a new word to titlecase.
function capitalizeLabel(label: string): string {
  return label
    .split(' ')
    .map((word) => {
      const dotIndex = word.indexOf('.');
      const head = dotIndex === -1 ? word : word.slice(0, dotIndex);
      const tail = dotIndex === -1 ? '' : word.slice(dotIndex);
      return head.charAt(0).toUpperCase() + head.slice(1) + tail;
    })
    .join(' ');
}

export function DesktopIcon({
  label,
  xPercent,
  yPercent,
  iconSrc,
  onOpen,
  playback,
}: DesktopIconProps) {
  const { offset, handlers } = useDrag(playback ? playback.onToggle : onOpen);

  return (
    <button
      type="button"
      className={styles.icon}
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
      {...handlers}
    >
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
      </span>
      <span className={styles.label}>{capitalizeLabel(label)}</span>
    </button>
  );
}
