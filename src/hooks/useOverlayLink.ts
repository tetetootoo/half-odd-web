import { useEffect, useRef } from 'react';

const historyKey = 'halfOddOverlay';

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
  const navigation = useRef<{ target: string | null } | null>(null);

  useEffect(() => {
    const navigate = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      const resolved = id ? callbacks.current.resolve(id) : null;
      if (id && !resolved) return;
      navigation.current = { target: resolved };
      if (resolved) callbacks.current.open(resolved);
      else callbacks.current.close();
    };
    navigate();
    window.addEventListener('popstate', navigate);
    window.addEventListener('hashchange', navigate);
    return () => {
      window.removeEventListener('popstate', navigate);
      window.removeEventListener('hashchange', navigate);
    };
  }, []);

  useEffect(() => {
    // History navigation updates React state asynchronously. Wait for it before
    // allowing state changes to write a new URL back into history.
    if (navigation.current) {
      if (navigation.current.target !== activeId) return;
      navigation.current = null;
      previousId.current = activeId;
      return;
    }
    if (previousId.current === activeId) return;
    const wasOpen = previousId.current !== null;
    previousId.current = activeId;
    const canonicalId = activeId === 'about' ? 'about-me' : activeId;
    const url = new URL(window.location.href);
    url.hash = canonicalId ? encodeURIComponent(canonicalId) : '';
    if (!activeId && window.history.state?.[historyKey]) {
      window.history.back();
      return;
    }
    // One entry per overlay session makes Back return straight to home, even
    // when another desktop window is focused or a different overlay opens.
    if (activeId && !wasOpen && !window.location.hash) {
      window.history.pushState({ ...window.history.state, [historyKey]: true }, '', url);
    } else {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [activeId]);
}
