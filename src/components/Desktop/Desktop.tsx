import { useMemo, useRef, useState } from 'react';
import { desktopItems, systemWindows, type DesktopItem } from '../../data/content';
import { MenuBar } from '../MenuBar/MenuBar';
import { DesktopIcon } from '../DesktopIcon/DesktopIcon';
import { Dock } from '../Dock/Dock';
import { WindowManager, type OpenWindow } from '../WindowManager/WindowManager';
import styles from './Desktop.module.css';

export function Desktop() {
  const itemsById = useMemo(() => {
    const map = new Map<string, DesktopItem>();
    for (const item of [...desktopItems, ...systemWindows]) {
      map.set(item.id, item);
    }
    return map;
  }, []);

  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const zCounterRef = useRef(1);

  const openWindow = (id: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) {
        return prev.map((w) =>
          w.id === id ? { ...w, zIndex: ++zCounterRef.current } : w,
        );
      }
      return [...prev, { id, zIndex: ++zCounterRef.current }];
    });
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounterRef.current } : w)),
    );
  };

  return (
    <div className={styles.desktop}>
      <MenuBar />
      <div className={styles.iconLayer}>
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            label={item.label}
            xPercent={item.x}
            yPercent={item.y}
            onOpen={() => openWindow(item.id)}
          />
        ))}
      </div>
      <WindowManager
        openWindows={openWindows}
        itemsById={itemsById}
        onClose={closeWindow}
        onFocus={focusWindow}
      />
      <Dock
        onOpenAboutMe={() => openWindow('about-me')}
        onOpenNotes={() => openWindow('notes')}
        onOpenSafari={() => openWindow('safari')}
        onOpenTrash={() => openWindow('trash')}
      />
    </div>
  );
}
