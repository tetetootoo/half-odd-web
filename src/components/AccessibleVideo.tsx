import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';

// Keep native playback controls available, including when motion is reduced.
export function AccessibleVideo({ autoPlay, loop, ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) ref.current?.pause();
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <video aria-label="Project video preview" {...props} ref={ref} controls autoPlay={!!autoPlay && !reduced} loop={!!loop && !reduced} />;
}
