import { useEffect, useState } from 'react';

export const MOBILE_BREAKPOINT_PX = 640;

function getQuery(breakpoint: number) {
  return `(max-width: ${breakpoint}px)`;
}

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT_PX): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(getQuery(breakpoint)).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(getQuery(breakpoint));
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}
