import { useLayoutEffect, useMemo, useState, type RefObject } from 'react';
import type { DesktopItem } from '../data/desktopContent';
import type { Position } from './useDrag';

// Keep the authored scattered layout; only nudge files that would collide
// after a viewport change. Normalized positions never overwrite saved ones.
export function useDesktopLayout(
  layerRef: RefObject<HTMLDivElement | null>,
  dockRef: RefObject<HTMLElement | null>,
  items: DesktopItem[],
  saved: Record<string, Position>,
  scrollable: boolean,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const layer = layerRef.current!;
    const measure = () => {
      const bounds = layer.getBoundingClientRect();
      const dock = dockRef.current?.getBoundingClientRect();
      setSize({ width: bounds.width, height: scrollable ? bounds.height : Math.min(bounds.height, dock ? dock.top - bounds.top - 12 : bounds.height) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    if (dockRef.current) observer.observe(dockRef.current);
    return () => observer.disconnect();
  }, [layerRef, dockRef, scrollable]);

  return useMemo(() => {
    if (!size.width || !size.height) return saved;
    const width = 96;
    const height = 116;
    const maxX = size.width - width;
    const maxY = size.height - height;
    // The CSS minimum height ensures room for files on compact desktops.
    const placed: Position[] = [];
    const result: Record<string, Position> = {};
    const fits = (p: Position) => placed.every(other => Math.abs(other.x - p.x) >= width || Math.abs(other.y - p.y) >= height);
    for (const item of items) {
      const desired = saved[item.id] ?? item;
      const origin = { x: Math.max(0, Math.min(maxX, desired.x / 100 * size.width)), y: Math.max(0, Math.min(maxY, desired.y / 100 * (layerRef.current?.clientHeight ?? size.height))) };
      let position = origin;
      if (!fits(origin)) {
        let distance = Infinity;
        for (let y = 0; y <= maxY; y += 8) for (let x = 0; x <= maxX; x += 8) {
          const candidate = { x, y };
          const nextDistance = Math.hypot(x - origin.x, y - origin.y);
          if (nextDistance < distance && fits(candidate)) { position = candidate; distance = nextDistance; }
        }
      }
      placed.push(position);
      result[item.id] = { x: position.x / size.width * 100, y: position.y / (layerRef.current?.clientHeight ?? size.height) * 100 };
    }
    return result;
  }, [items, saved, size, layerRef]);
}
