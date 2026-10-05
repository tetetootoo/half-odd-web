import { useEffect, useRef, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

// A small radial threshold keeps dragging immediate without moving icons
// during ordinary single or double clicks.
const DEFAULT_THRESHOLD_PX = 5;

// Presses that start on a nested control (a traffic light inside a title
// bar, say) belong to that control, never to the drag surface around it.
const NESTED_CONTROL = 'button, a, input, textarea, select, [data-no-drag]';

interface DragOptions {
  threshold?: number;
  disabled?: boolean;
  onDragStart?: (e: React.PointerEvent, origin: Position) => void;
  onDragMove?: (offset: Position, e: React.PointerEvent) => void;
  onDragCancel?: () => void;
  onDragEnd?: (offset: Position, e: React.PointerEvent) => void;
  // Constrains the live offset, e.g. to keep a title bar reachable.
  clamp?: (offset: Position) => Position;
}

/**
 * Tracks a pixel drag offset to apply on top of a fixed base position (e.g.
 * percent-based `left`/`top`), so drag deltas never get mixed with the base
 * position's unit. `onDragEnd` receives the final offset; callers fold it
 * into their own base position, since the internal offset resets to zero
 * right after. Clicks are left to the element's native `click` event (so
 * Enter/Space work too) and are suppressed when the press was a drag.
 */
export function useDrag({
  threshold = DEFAULT_THRESHOLD_PX,
  disabled = false,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel,
  clamp,
}: DragOptions = {}) {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef<number | null>(null);
  const pendingEventRef = useRef<React.PointerEvent | null>(null);
  const pressedRef = useRef(false);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (pressedRef.current) delete document.documentElement.dataset.dragging;
  }, []);

  const endDrag = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    pendingEventRef.current = null;
    pressedRef.current = false;
    movedRef.current = false;
    offsetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    delete document.documentElement.dataset.dragging;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0 || !e.isPrimary) return;
    const nested = (e.target as Element).closest(NESTED_CONTROL);
    if (nested && nested !== e.currentTarget) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pressedRef.current = true;
    movedRef.current = false;
    suppressClickRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pressedRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (!movedRef.current) {
      if (Math.hypot(dx, dy) <= threshold) return;
      movedRef.current = true;
      setIsDragging(true);
      document.documentElement.dataset.dragging = '';
      onDragStart?.(e, startRef.current);
    }
    const next = clamp ? clamp({ x: dx, y: dy }) : { x: dx, y: dy };
    offsetRef.current = next;
    pendingEventRef.current = e;
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setOffset(offsetRef.current);
        if (pendingEventRef.current) onDragMove?.(offsetRef.current, pendingEventRef.current);
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!pressedRef.current) return;
    if (movedRef.current) {
      suppressClickRef.current = true;
      // The click that follows a drag arrives synchronously after pointerup;
      // if the element was removed (e.g. dropped in the Trash) it never does.
      setTimeout(() => (suppressClickRef.current = false), 0);
      onDragEnd?.(offsetRef.current, e);
    }
    endDrag();
  };

  const onPointerCancel = () => {
    if (!pressedRef.current) return;
    onDragCancel?.();
    endDrag();
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    offset,
    isDragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture: onPointerCancel, onClickCapture },
  };
}
