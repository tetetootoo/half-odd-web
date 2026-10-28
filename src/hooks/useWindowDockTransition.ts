import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import type { WindowPhase } from './useWindowManager';

// Animate the inner window; the outer wrapper keeps ownership of layout/drag transforms.
export function useWindowDockTransition(
  elementRef: RefObject<HTMLDivElement | null>,
  id: string,
  phase: WindowPhase,
  onMinimized: (hadFocus: boolean) => void,
) {
  const progress = useRef({ value: 0 });
  const destination = useRef({ x: 0, y: 0, scale: .08 });
  const complete = useRef(onMinimized);
  complete.current = onMinimized;

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || phase === 'minimized') return;
    const minimizing = phase === 'minimizing';
    if (!minimizing && progress.current.value === 0) return;
    if (phase === 'closing') {
      progress.current.value = 0;
      gsap.set(element, { clearProps: 'transform,opacity,transformOrigin' });
      return;
    }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hadFocus = element.contains(document.activeElement);
    if (minimizing) {
      const target = Array.from(document.querySelectorAll<HTMLElement>('[data-dock-window]'))
        .find(node => node.dataset.dockWindow === id);
      const dock = target?.getBoundingClientRect();
      // offset dimensions are unaffected by the running GSAP transform.
      const wrapper = element.parentElement!.getBoundingClientRect();
      destination.current = {
        x: (dock ? dock.left + dock.width / 2 : window.innerWidth / 2) - (wrapper.left + element.offsetWidth / 2),
        y: (dock ? dock.top + dock.height / 2 : window.innerHeight - 32) - (wrapper.top + element.offsetHeight / 2),
        scale: dock ? Math.min(.2, dock.width / element.offsetWidth, dock.height / element.offsetHeight) : .08,
      };
    }
    const render = () => {
      const p = progress.current.value;
      const to = destination.current;
      gsap.set(element, {
        x: preference.matches ? 0 : to.x * p,
        y: preference.matches ? 0 : to.y * p,
        scale: preference.matches ? 1 : 1 + (to.scale - 1) * p,
        opacity: 1 - p,
        transformOrigin: '50% 50%',
      });
    };
    const tween = gsap.to(progress.current, {
      value: minimizing ? 1 : 0,
      duration: preference.matches ? 0 : .42 * Math.abs((minimizing ? 1 : 0) - progress.current.value),
      ease: 'power2.inOut',
      onUpdate: render,
      onComplete: () => {
        if (minimizing) complete.current(hadFocus);
        else gsap.set(element, { clearProps: 'transform,opacity,transformOrigin' });
      },
    });
    const reduceMotion = () => { if (preference.matches) tween.progress(1); };
    preference.addEventListener('change', reduceMotion);
    return () => {
      // Preserve the current progress so a changed destination never jumps.
      tween.kill();
      preference.removeEventListener('change', reduceMotion);
    };
  }, [elementRef, id, phase]);
}
