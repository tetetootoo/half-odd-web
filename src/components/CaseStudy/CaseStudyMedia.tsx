import { useEffect, useRef, useState } from 'react';
import type { MediaSlot } from '../../data/caseStudies';
import styles from './MarkdownDoc.module.css';

export function CaseStudyMedia({ media }: { media: MediaSlot }) {
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (visible && !preference.matches) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.25 });
    observer.observe(element);
    preference.addEventListener('change', update);
    return () => { observer.disconnect(); preference.removeEventListener('change', update); element.pause(); };
  }, [media.src]);
  return <figure className={styles.media}>
    <div className={styles.mediaFrame} style={{ aspectRatio: media.ratio ?? '16 / 10' }}>
      {!media.src || failed ? <div className={styles.placeholder}><span>{media.label}</span><small>Media coming soon</small></div>
        : media.type === 'video' ? <video ref={video} src={media.src} muted loop playsInline controls preload="metadata" onError={() => setFailed(true)} aria-label={media.label} />
          : <img src={media.src} alt={media.label} loading="lazy" onError={() => setFailed(true)} />}
    </div>
    <figcaption>{media.label}</figcaption>
  </figure>;
}
