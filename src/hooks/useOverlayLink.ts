import { useEffect, useRef } from 'react';

// Hash routes work on static hosting without server-side rewrite rules.
export function useOverlayLink(
  activeId: string | null,
  resolve: (id: string) => string | null,
  open: (id: string) => void,
  close: () => void,
) {
  const callbacks = useRef({ resolve, open, close });
  callbacks.current = { resolve, open, close };
  const previousId = useRef(activeId);

  useEffect(() => {
    const navigate = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (!id) { callbacks.current.close(); return; }
      const resolved = callbacks.current.resolve(id);
      if (resolved) callbacks.current.open(resolved);
    };
    navigate();
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);

  useEffect(() => {
    if (previousId.current === activeId) return;
    previousId.current = activeId;
    const canonicalId = activeId === 'about' ? 'about-me' : activeId;
    const url = new URL(window.location.href);
    url.hash = canonicalId ? encodeURIComponent(canonicalId) : '';
    window.history.replaceState(window.history.state, '', url);
  }, [activeId]);
}
