import { useRef, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

const CLICK_THRESHOLD_PX = 4;

/**
 * Tracks a pixel drag offset to apply as a CSS transform on top of a fixed
 * base position (e.g. percent-based `left`/`top`), so drag deltas never get
 * mixed with the base position's unit. Fires `onClick` when a press ends
 * without exceeding the movement threshold.
 */
export function useDrag(onClick?: () => void) {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startRef = useRef({ pointerX: 0, pointerY: 0, originX: 0, originY: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startRef.current.pointerX;
    const dy = e.clientY - startRef.current.pointerY;
    if (Math.abs(dx) > CLICK_THRESHOLD_PX || Math.abs(dy) > CLICK_THRESHOLD_PX) {
      movedRef.current = true;
    }
    if (movedRef.current) {
      setOffset({
        x: startRef.current.originX + dx,
        y: startRef.current.originY + dy,
      });
    }
  };

  const onPointerUp = () => {
    if (draggingRef.current && !movedRef.current) {
      onClick?.();
    }
    draggingRef.current = false;
  };

  return {
    offset,
    handlers: { onPointerDown, onPointerMove, onPointerUp },
  };
}
