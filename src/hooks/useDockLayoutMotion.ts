import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

type Slot = { element: HTMLElement; left: number; top: number };

// Animate layout movement on the outer slot; hover magnification stays on its child.
export function useDockLayoutMotion(host: RefObject<HTMLElement | null>, layoutKey: string) {
  const slots = useRef(new Map<string, Slot>());
  const animations = useRef(new Map<HTMLElement, Animation>());

  useLayoutEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previous = new Map<string, { left: number; top: number }>();
    for (const [key, slot] of slots.current) {
      // Include any unfinished movement before restarting at a new destination.
      const transform = getComputedStyle(slot.element).transform;
      const matrix = transform === 'none' ? null : new DOMMatrixReadOnly(transform);
      previous.set(key, { left: slot.left + (matrix?.m41 ?? 0), top: slot.top + (matrix?.m42 ?? 0) });
    }
    for (const animation of animations.current.values()) animation.cancel();
    animations.current.clear();

    const next = new Map<string, Slot>();
    for (const element of root.querySelectorAll<HTMLElement>('[data-dock-key]')) {
      const key = element.dataset.dockKey!;
      const bounds = element.getBoundingClientRect();
      next.set(key, { element, left: bounds.left, top: bounds.top });
      if (reduced) continue;
      const old = previous.get(key);
      const dx = old ? old.left - bounds.left : 0;
      const dy = old ? old.top - bounds.top : 0;
      if (old && Math.abs(dx) < .5 && Math.abs(dy) < .5) continue;
      const animation = element.animate(
        old
          ? [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }]
          : [{ opacity: 0 }, { opacity: 1 }],
        { duration: old ? 440 : 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      animations.current.set(element, animation);
    }
    slots.current = next;
  }, [host, layoutKey]);

  useEffect(() => {
    const running = animations.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {
      if (preference.matches) {
        for (const animation of running.values()) animation.cancel();
        running.clear();
      }
    };
    preference.addEventListener('change', finish);
    return () => {
      preference.removeEventListener('change', finish);
      for (const animation of running.values()) animation.cancel();
      running.clear();
    };
  }, []);
}
