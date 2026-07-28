import { useDrag } from '../../hooks/useDrag';
import styles from './DesktopIcon.module.css';

interface DesktopIconProps {
  label: string;
  xPercent: number;
  yPercent: number;
  onOpen: () => void;
}

export function DesktopIcon({ label, xPercent, yPercent, onOpen }: DesktopIconProps) {
  const { offset, handlers } = useDrag(onOpen);

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
      <span className={styles.glyph} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </button>
  );
}
