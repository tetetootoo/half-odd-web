import { useEffect, useState } from 'react';
import { desktopItems, type WindowKind } from '../data/desktopContent';
import type { Position } from './useDrag';

// A desktop item moved to the Trash. Only a reference plus what's needed to
// list and put it back — the item's content always comes from desktopContent.
export interface TrashEntry {
  id: string;
  kind: WindowKind;
  label: string;
  // Where it sat on the desktop, so Put Back can return it there.
  x: number;
  y: number;
}

interface StoredDesktop {
  // Only icons the visitor has moved; everything else keeps its default from
  // desktopContent, so layout changes shipped later still reach them.
  positions: Record<string, Position>;
  trash: TrashEntry[];
}

const STORAGE_KEY = 'half-odd:desktop:v1';
const knownIds = new Set(desktopItems.map((item) => item.id));

function isPosition(value: unknown): value is Position {
  const p = value as Position;
  return typeof p?.x === 'number' && typeof p?.y === 'number' && isFinite(p.x) && isFinite(p.y);
}

// Anything unreadable or pointing at items that no longer exist is dropped,
// so stale storage can never break the desktop.
function load(): StoredDesktop {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<StoredDesktop> | null;
    const positions = Object.fromEntries(
      Object.entries(raw?.positions ?? {}).filter(([id, p]) => knownIds.has(id) && isPosition(p)),
    );
    const trash = (Array.isArray(raw?.trash) ? raw.trash : []).filter(
      (entry, i, all) =>
        knownIds.has(entry?.id) && isPosition(entry) && all.findIndex((e) => e.id === entry.id) === i,
    );
    return { positions, trash };
  } catch {
    return { positions: {}, trash: [] };
  }
}

export function useDesktopState() {
  const [initial] = useState(load);
  const [iconPositions, setIconPositions] = useState(initial.positions);
  const [trash, setTrash] = useState(initial.trash);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ positions: iconPositions, trash }));
    } catch {
      // Private mode or full storage: the desktop still works, it just won't remember.
    }
  }, [iconPositions, trash]);

  return { iconPositions, setIconPositions, trash, setTrash };
}
