import type { DesktopItem } from '../../data/desktopContent';
import type { useWindowManager } from '../../hooks/useWindowManager';
import { Window, type WorkArea } from '../Window/Window';

interface WindowManagerProps {
  manager: ReturnType<typeof useWindowManager>;
  itemsById: Map<string, DesktopItem>;
  getWorkArea: () => WorkArea;
  onOpenItem: (id: string) => void;
}

export function WindowManager({ manager, itemsById, getWorkArea, onOpenItem }: WindowManagerProps) {
  return (
    <>
      {manager.windows.map((managed) => {
        const item = itemsById.get(managed.id);
        if (!item) return null;
        const { id } = managed;
        return (
          <Window
            key={id}
            item={item}
            managed={managed}
            zIndex={manager.zIndexOf(id)}
            isActive={manager.activeId === id}
            getWorkArea={getWorkArea}
            onFocus={() => manager.focus(id)}
            onClose={() => manager.close(id)}
            onMinimize={() => manager.minimize(id)}
            onFinishClose={(hadFocus) => manager.finishClose(id, hadFocus)}
            onFinishMinimize={(hadFocus) => manager.finishMinimize(id, hadFocus)}
            onOpenItem={onOpenItem}
          />
        );
      })}
    </>
  );
}
