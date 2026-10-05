import { useEffect, useState } from 'react';
import type { MediaSlot } from '../../data/caseStudies';
import styles from './MarkdownDoc.module.css';

export function CaseStudyMedia({ media }: { media: MediaSlot }) {
  const [reduceMotion, setReduceMotion] = useState(() => media.respectReducedMotion && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!media.respectReducedMotion) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [media.respectReducedMotion]);
  const [failed, setFailed] = useState(false);
  return <figure className={`${styles.media} ${media.labelAbove ? styles.labelAbove : ''}`}>
    {media.labelAbove && <figcaption>{media.label}</figcaption>}
    <div className={styles.mediaFrame} style={{ aspectRatio: media.ratio ?? '16 / 10' }}>
      {!media.src || failed ? <div className={styles.placeholder}><span>{media.label}</span><small>Media coming soon</small></div>
        : media.type === 'video' ? reduceMotion && media.poster ? <img src={media.poster} alt={media.alt ?? media.label} /> : <video src={media.src} poster={media.poster} autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback preload={media.respectReducedMotion ? 'metadata' : 'auto'} onError={() => setFailed(true)} aria-label={media.alt ?? media.label} />
          : <img src={media.src} alt={media.alt ?? media.label} loading="lazy" onError={() => setFailed(true)} />}
    </div>
    {!media.hideCaption && !media.labelAbove && <figcaption>{media.label}</figcaption>}
  </figure>;
}
