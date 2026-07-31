import type { DesktopItem } from '../../data/desktopContent';
import { Window } from '../Window/Window';

export interface OpenWindow {
  id: string;
  zIndex: number;
}

interface WindowManagerProps {
  openWindows: OpenWindow[];
  itemsById: Map<string, DesktopItem>;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onOpenItem: (id: string) => void;
}

export function WindowManager({ openWindows, itemsById, onClose, onFocus, onOpenItem }: WindowManagerProps) {
  return (
    <>
      {openWindows.map(({ id, zIndex }, index) => {
        const item = itemsById.get(id);
        if (!item) return null;
        return (
          <Window
            key={id}
            item={item}
            zIndex={zIndex}
            cascadeIndex={index}
            onClose={() => onClose(id)}
            onFocus={() => onFocus(id)}
            onOpenItem={onOpenItem}
          />
        );
      })}
    </>
  );
}
