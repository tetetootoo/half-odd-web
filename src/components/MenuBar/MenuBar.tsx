import { useClock } from '../../hooks/useClock';
import styles from './MenuBar.module.css';

const LOCATION = 'Copenhagen, DK';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}

export function MenuBar() {
  const now = useClock();

  return (
    <header className={styles.menuBar}>
      <div className={styles.logo} aria-hidden="true" />
      <div className={styles.right}>
        <svg
          className={styles.battery}
          width="22"
          height="11"
          viewBox="0 0 22 11"
          fill="none"
          aria-hidden="true"
        >
          <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" />
          <rect x="20" y="3.5" width="1.5" height="4" rx="0.75" fill="currentColor" />
          <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor" />
        </svg>
        <span>{LOCATION}</span>
        <span>{formatDate(now)}</span>
        <span className={styles.clock}>{formatTime(now)}</span>
      </div>
    </header>
  );
}
