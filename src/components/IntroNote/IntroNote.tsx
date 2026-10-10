import { useLayoutEffect, useRef, useState } from 'react';
import { useDrag, type Position } from '../../hooks/useDrag';
import styles from './IntroNote.module.css';

export function IntroNote({ desktop = false }: { desktop?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const draggedPosition = useRef<Position | null>(null);

  // Measure actual icon labels as well as their glyphs. Leave room for the
  // rotated paper corners and keep the dock outside the available area.
  const geometry = () => {
    const note = ref.current!;
    const layer = note.parentElement!;
    const bounds = layer.getBoundingClientRect();
    const dock = layer.closest('[data-desktop]')?.querySelector('nav')?.getBoundingClientRect();
    const width = note.offsetWidth;
    const height = note.offsetHeight;
    const maxX = Math.max(8, bounds.width - width - 8);
    const maxY = Math.max(8, Math.min(bounds.height, dock ? dock.top - bounds.top : bounds.height) - height - 16);
    const icons = Array.from(layer.querySelectorAll<HTMLElement>(':scope > button, :scope > a')).map(el => el.getBoundingClientRect());
    const fits = (p: Position) => icons.every(icon =>
      p.x + width + 12 <= icon.left - bounds.left || p.x - 12 >= icon.right - bounds.left ||
      p.y + height + 12 <= icon.top - bounds.top || p.y - 12 >= icon.bottom - bounds.top);
    return { bounds, maxX, maxY, fits };
  };

  useLayoutEffect(() => {
    if (!desktop) return;
    const note = ref.current!;
    const layer = note.parentElement!;
    const place = () => {
      const { bounds, maxX, maxY, fits } = geometry();
      const preferred = draggedPosition.current ?? { x: bounds.width * 0.64, y: bounds.height * 0.36 };
      const origin = { x: Math.min(maxX, Math.max(8, preferred.x)), y: Math.min(maxY, Math.max(8, preferred.y)) };
      if (fits(origin)) {
        setPosition(previous => previous?.x === origin.x && previous.y === origin.y ? previous : origin);
        return;
      }
      const candidates = [origin];
      for (let y = 8; y <= maxY; y += 8) {
        for (let x = 8; x <= maxX; x += 8) candidates.push({ x, y });
      }
      candidates.sort((a, b) => Math.hypot(a.x - origin.x, a.y - origin.y) - Math.hypot(b.x - origin.x, b.y - origin.y));
      setPosition(candidates.find(fits) ?? origin);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(layer);
    observer.observe(note);
    // Recheck when existing icons are moved or restored.
    const mutations = new MutationObserver(records => {
      if (records.some(record => !note.contains(record.target))) place();
    });
    mutations.observe(layer, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [desktop]);

  const { offset, handlers } = useDrag({
    disabled: !desktop,
    clamp: delta => {
      const { maxX, maxY } = geometry();
      const base = position ?? { x: 8, y: 8 };
      return { x: Math.min(maxX - base.x, Math.max(8 - base.x, delta.x)), y: Math.min(maxY - base.y, Math.max(8 - base.y, delta.y)) };
    },
    onDragEnd: delta => {
      if (!position) return;
      const next = { x: position.x + delta.x, y: position.y + delta.y };
      if (geometry().fits(next)) {
        draggedPosition.current = next;
        setPosition(next);
      }
    },
  });

  return (
    <aside
      ref={ref}
      aria-label="introduction"
      className={`${styles.note} ${desktop ? styles.desktop : ''}`}
      style={desktop ? { left: position?.x ?? '64%', top: position?.y ?? '36%', translate: `${offset.x}px ${offset.y}px` } : undefined}
      {...handlers}
    >
      <div data-no-drag>
        <h1>hi, i'm theresa.</h1>
        <p>designer &amp; software engineer.</p>
        <p>i design and build digital products, from the first idea to the working thing.</p>
      </div>
    </aside>
  );
}
