import { createContext, useContext } from 'react';
import type { DesktopItem } from '../../data/desktopContent';
import type { TrashEntry } from '../../hooks/useDesktopState';
import type { Position } from '../../hooks/useDrag';

interface TrashContextValue {
  // Items the visitor trashed from the desktop; these can be put back.
  entries: TrashEntry[];
  // Items that ship inside the Trash (desktopContent's trashItems); these
  // only open, since they never had a desktop spot to return to.
  builtIn: DesktopItem[];
  // A desktop icon is currently being dragged over a Trash drop target.
  dropActive: boolean;
  onOpen: (id: string, opener: HTMLElement) => void;
  onPutBack: (id: string) => void;
  // Dragging an entry out of the Trash window onto the desktop. `grab` is
  // the pointer's offset inside the dragged icon, so it never jumps.
  onDragOutMove: (id: string, pointer: Position, grab: Position) => void;
  onDragOutEnd: (id: string, pointer: Position) => void;
}

export const TrashContext = createContext<TrashContextValue | null>(null);

export function useTrash() {
  const value = useContext(TrashContext);
  if (!value) throw new Error('useTrash must be used inside the Desktop');
  return value;
}
