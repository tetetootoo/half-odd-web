import { useState } from 'react';
import type { MediaSlot } from '../../data/caseStudies';
import styles from './MarkdownDoc.module.css';

export function CaseStudyMedia({ media }: { media: MediaSlot }) {
  const [failed, setFailed] = useState(false);
  return <figure className={styles.media}>
    <div className={styles.mediaFrame} style={{ aspectRatio: media.ratio ?? '16 / 10' }}>
      {!media.src || failed ? <div className={styles.placeholder}><span>{media.label}</span><small>Media coming soon</small></div>
        : media.type === 'video' ? <video src={media.src} autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback preload="auto" onError={() => setFailed(true)} aria-label={media.label} />
          : <img src={media.src} alt={media.label} loading="lazy" onError={() => setFailed(true)} />}
    </div>
    {!media.hideCaption && <figcaption>{media.label}</figcaption>}
  </figure>;
}
