import { useEffect, useMemo, useRef, useState } from 'react';
import { desktopItems, systemWindows, type DesktopItem } from '../../data/desktopContent';
import { MenuBar } from '../MenuBar/MenuBar';
import { DesktopIcon } from '../DesktopIcon/DesktopIcon';
import { Dock } from '../Dock/Dock';
import { WindowManager, type OpenWindow } from '../WindowManager/WindowManager';
import type { Position } from '../../hooks/useDrag';
import styles from './Desktop.module.css';

type IconPositions = Record<string, Position>;

export function Desktop() {
  const itemsById = useMemo(() => {
    const map = new Map<string, DesktopItem>();
    for (const item of [...desktopItems, ...systemWindows]) {
      map.set(item.id, item);
    }
    for (const trashItem of systemWindows.find((w) => w.id === 'trash')?.trashItems ?? []) {
      map.set(trashItem.id, trashItem);
    }
    return map;
  }, []);

  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const zCounterRef = useRef(1);
  const iconLayerRef = useRef<HTMLDivElement>(null);
  const [iconPositions, setIconPositions] = useState<IconPositions>({});

  const getIconPosition = (item: DesktopItem): Position =>
    iconPositions[item.id] ?? { x: item.x, y: item.y };

  const handleIconDragEnd = (item: DesktopItem, pixelOffset: Position) => {
    const layer = iconLayerRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const current = getIconPosition(item);
    const next: Position = {
      x: current.x + (pixelOffset.x / rect.width) * 100,
      y: current.y + (pixelOffset.y / rect.height) * 100,
    };
    setIconPositions((prev) => ({ ...prev, [item.id]: next }));
  };

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

  // "The View - DAO" plays/pauses directly from its desktop icon instead of
  // opening a window — see audioItem below.
  const audioItem = desktopItems.find((item) => item.kind === 'audio');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <div className={styles.desktop}>
      <MenuBar />
      <div className={styles.iconLayer} ref={iconLayerRef}>
        {desktopItems.map((item) => {
          const position = getIconPosition(item);
          return item.kind === 'audio' ? (
            <DesktopIcon
              key={item.id}
              label={item.label}
              xPercent={position.x}
              yPercent={position.y}
              iconSrc={item.posterSrc}
              onDragEnd={(offset) => handleIconDragEnd(item, offset)}
              playback={{ isPlaying: isAudioPlaying, onToggle: toggleAudio }}
            />
          ) : (
            <DesktopIcon
              key={item.id}
              label={item.label}
              xPercent={position.x}
              yPercent={position.y}
              iconSrc={item.iconSrc}
              href={item.kind === 'link' ? item.link?.url : undefined}
              onOpen={() => openWindow(item.id)}
              onDragEnd={(offset) => handleIconDragEnd(item, offset)}
              showLinkBadge={item.showLinkBadge}
            />
          );
        })}
      </div>
      {audioItem && (
        <audio
          ref={audioRef}
          src={audioItem.mediaSrc}
          onPlay={() => setIsAudioPlaying(true)}
          onPause={() => setIsAudioPlaying(false)}
          onEnded={() => setIsAudioPlaying(false)}
        />
      )}
      <WindowManager
        openWindows={openWindows}
        itemsById={itemsById}
        onClose={closeWindow}
        onFocus={focusWindow}
        onOpenItem={openWindow}
      />
      <Dock
        onOpenAboutMe={() => openWindow('about-me')}
        onOpenNotes={() => openWindow('notes')}
        onOpenMail={() => openWindow('mail')}
        onOpenTrash={() => openWindow('trash')}
      />
    </div>
  );
}
