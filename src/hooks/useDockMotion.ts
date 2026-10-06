import { useEffect, useRef, type PointerEvent } from 'react';

// Critical/over-damped spring; DOM updates avoid rendering React on pointer move.
export function useDockMotion() {
  const host = useRef<HTMLElement | null>(null);
  const pointer = useRef<number | null>(null);
  const requestTick = useRef<() => void>(() => {});
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const states = new Map<HTMLElement, { scale: number; velocity: number }>();
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min((now - (last || now - 16)) / 1000, .032);
      last = now;
      let unsettled = false;
      for (const face of host.current?.querySelectorAll<HTMLElement>('[data-dock-face]') ?? []) {
        const item = face.parentElement!;
        const bounds = item.getBoundingClientRect();
        const distance = pointer.current === null ? Infinity : Math.abs(pointer.current - (bounds.left + bounds.width / 2));
        const target = preference.matches || !finePointer.matches ? 1 : 1 + .26 * Math.exp(-Math.pow(distance / 68, 2));
        const state = states.get(face) ?? { scale: 1, velocity: 0 };
        if (preference.matches || !finePointer.matches) { state.scale = 1; state.velocity = 0; }
        else for (let step = 0; step < 4; step++) {
          const slice = dt / 4;
          state.velocity += ((360 * (target - state.scale) - 30 * state.velocity) / .55) * slice;
          state.scale += state.velocity * slice;
        }
        const moving = Math.abs(target - state.scale) > .0002 || Math.abs(state.velocity) > .002;
        if (!moving) { state.scale = target; state.velocity = 0; }
        face.style.scale = String(state.scale);
        states.set(face, state);
        unsettled ||= moving;
      }
      if (unsettled) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
    requestTick.current = schedule;
    preference.addEventListener('change', schedule);
    finePointer.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); preference.removeEventListener('change', schedule); finePointer.removeEventListener('change', schedule); };
  }, []);
  return {
    host,
    onPointerMove: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') { pointer.current = event.clientX; requestTick.current(); } },
    onPointerLeave: () => { pointer.current = null; requestTick.current(); },
  };
}
