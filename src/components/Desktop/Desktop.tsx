import { useEffect, useMemo, useRef, useState } from 'react';
import { desktopItems, systemWindows, type DesktopItem } from '../../data/desktopContent';
import { MenuBar } from '../MenuBar/MenuBar';
import { DesktopIcon, DesktopIconGhost } from '../DesktopIcon/DesktopIcon';
import { capitalizeLabel } from '../DesktopIcon/capitalizeLabel';
import { Dock } from '../Dock/Dock';
import { WindowManager } from '../WindowManager/WindowManager';
import { TrashContext } from '../Trash/TrashContext';
import type { WorkArea } from '../Window/Window';
import type { Position } from '../../hooks/useDrag';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useDesktopState } from '../../hooks/useDesktopState';
import styles from './Desktop.module.css';

// Approximate desktop icon footprint (see DesktopIcon.module.css), used to
// keep icons on screen and to find a free spot when putting one back.
const ICON_WIDTH_PX = 88;
const ICON_HEIGHT_PX = 100;
const FREE_SPOT_SEARCH_RINGS = 12;

const builtInTrash = systemWindows.find((w) => w.id === 'trash')?.trashItems ?? [];

// Built from the same capitalized text the icon shows, so the accessible
// name matches what's on screen.
function ariaLabelFor(item: DesktopItem, isPlaying: boolean): string {
  const label = capitalizeLabel(item.label);
  switch (item.kind) {
    case 'link':
      return `Open ${label} in new tab`;
    case 'audio':
      return `${isPlaying ? 'Pause' : 'Play'} ${label}`;
    case 'markdown':
      return `Open ${label.replace(/\.md$/, '')} case study`;
    default:
      return `Open ${label}`;
  }
}

// The drop target (if any) under the pointer, ignoring the icon being dragged.
function isOverTrash(pointer: Position): boolean {
  const hit = document
    .elementsFromPoint(pointer.x, pointer.y)
    .find((el) => !el.closest('[data-dragging-icon]'));
  return !!hit?.closest('[data-drop-target="trash"]');
}

export function Desktop() {
  const itemsById = useMemo(() => {
    const map = new Map<string, DesktopItem>();
    for (const item of [...desktopItems, ...systemWindows, ...builtInTrash]) {
      map.set(item.id, item);
    }
    return map;
  }, []);

  const manager = useWindowManager();
  const { iconPositions, setIconPositions, trash, setTrash } = useDesktopState();
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [restoredIds, setRestoredIds] = useState<Set<string>>(new Set());
  const trashTimers = useRef(new Map<string, number>());
  useEffect(() => {
    const timers = trashTimers.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trashDropActive, setTrashDropActive] = useState(false);
  const [trashGhost, setTrashGhost] = useState<{ id: string; left: number; top: number } | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);
  const iconLayerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);

  const trashedIds = new Set(trash.map((entry) => entry.id));
  const visibleItems = desktopItems.filter((item) => !trashedIds.has(item.id));

  const getIconPosition = (item: DesktopItem): Position =>
    iconPositions[item.id] ?? { x: item.x, y: item.y };

  const getWorkArea = (): WorkArea => {
    const desktop = desktopRef.current!.getBoundingClientRect();
    const layer = iconLayerRef.current!.getBoundingClientRect();
    const dock = dockRef.current?.getBoundingClientRect();
    return {
      top: layer.top - desktop.top,
      bottom: (dock?.top ?? desktop.bottom) - desktop.top,
      width: desktop.width,
      height: desktop.height,
    };
  };

  // Keeps a whole icon inside the icon layer so nothing gets lost off screen.
  const clampToLayer = (xPx: number, yPx: number, layer: DOMRect): Position => ({
    x: (Math.min(Math.max(xPx, 0), Math.max(0, layer.width - ICON_WIDTH_PX)) / layer.width) * 100,
    y: (Math.min(Math.max(yPx, 0), Math.max(0, layer.height - ICON_HEIGHT_PX)) / layer.height) * 100,
  });

  // Nearest spot to `desired` (percent) that no other icon overlaps,
  // searching outward in icon-sized steps.
  const findFreePosition = (desired: Position, excludeId: string): Position => {
    const layer = iconLayerRef.current?.getBoundingClientRect();
    if (!layer) return desired;
    const others = visibleItems
      .filter((item) => item.id !== excludeId)
      .map((item) => {
        const p = getIconPosition(item);
        return { x: (p.x / 100) * layer.width, y: (p.y / 100) * layer.height };
      });
    const origin = { x: (desired.x / 100) * layer.width, y: (desired.y / 100) * layer.height };
    const fits = (x: number, y: number) =>
      x >= 0 &&
      y >= 0 &&
      x <= layer.width - ICON_WIDTH_PX &&
      y <= layer.height - ICON_HEIGHT_PX &&
      others.every((o) => Math.abs(o.x - x) >= ICON_WIDTH_PX || Math.abs(o.y - y) >= ICON_HEIGHT_PX);

    for (let ring = 0; ring <= FREE_SPOT_SEARCH_RINGS; ring++) {
      const candidates: Position[] = [];
      for (let i = -ring; i <= ring; i++) {
        for (let j = -ring; j <= ring; j++) {
          if (Math.max(Math.abs(i), Math.abs(j)) !== ring) continue;
          candidates.push({ x: origin.x + i * (ICON_WIDTH_PX + 8), y: origin.y + j * (ICON_HEIGHT_PX + 8) });
        }
      }
      candidates.sort((a, b) => Math.hypot(a.x - origin.x, a.y - origin.y) - Math.hypot(b.x - origin.x, b.y - origin.y));
      const free = candidates.find((c) => fits(c.x, c.y));
      if (free) return clampToLayer(free.x, free.y, layer);
    }
    return clampToLayer(origin.x, origin.y, layer);
  };

  // "The View - DAO" plays/pauses directly from its desktop icon instead of
  // opening a window.
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

  // The one place that decides what "opening" an item means: external links
  // leave for a new tab, audio toggles, everything else gets a window.
  const activate = (id: string, opener: HTMLElement | null) => {
    const item = itemsById.get(id);
    if (!item) return;
    if (item.kind === 'link') {
      if (item.link) window.open(item.link.url, '_blank', 'noopener,noreferrer');
    } else if (item.kind === 'audio') {
      toggleAudio();
    } else {
      manager.open(id, opener);
    }
  };

  const openFromContent = (id: string) => activate(id, document.activeElement as HTMLElement | null);

  const moveToTrash = (item: DesktopItem) => {
    if (item.trashable === false || trashedIds.has(item.id) || trashTimers.current.has(item.id)) return;
    const { x, y } = getIconPosition(item);
    setExitingIds((prev) => new Set(prev).add(item.id));
    const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-close')) || 1;
    trashTimers.current.set(item.id, window.setTimeout(() => {
      trashTimers.current.delete(item.id);
      setExitingIds((prev) => { const next = new Set(prev); next.delete(item.id); return next; });
      setRestoredIds((prev) => { const next = new Set(prev); next.delete(item.id); return next; });
      setTrash((prev) => [...prev, { id: item.id, kind: item.kind, label: item.label, x, y }]);
      setIconPositions((prev) => {
        const { [item.id]: _removed, ...rest } = prev;
        return rest;
      });
      setSelectedId((current) => current === item.id ? null : current);
    }, duration));
  };

  // Put an item back from the Trash: at `at` when dragged out to a spot,
  // otherwise at its old spot, or the nearest free one if that's now taken.
  const putBack = (id: string, at?: Position) => {
    const entry = trash.find((e) => e.id === id);
    if (!entry) return;
    const position = at ?? findFreePosition({ x: entry.x, y: entry.y }, id);
    setRestoredIds((prev) => new Set(prev).add(id));
    setTrash((prev) => prev.filter((e) => e.id !== id));
    setIconPositions((prev) => ({ ...prev, [id]: position }));
  };

  const handleIconDrop = (item: DesktopItem, offset: Position, pointer: Position) => {
    setTrashDropActive(false);
    if (item.trashable !== false && isOverTrash(pointer)) {
      moveToTrash(item);
      return;
    }
    const layer = iconLayerRef.current?.getBoundingClientRect();
    if (!layer) return;
    const current = getIconPosition(item);
    const next = clampToLayer(
      (current.x / 100) * layer.width + offset.x,
      (current.y / 100) * layer.height + offset.y,
      layer,
    );
    setIconPositions((prev) => ({ ...prev, [item.id]: next }));
  };

  // Keyboard trashing removes the focused icon, so hand focus to a neighbour.
  const trashFromKeyboard = (item: DesktopItem) => {
    const current = document.activeElement;
    const neighbour = (current?.nextElementSibling ?? current?.previousElementSibling) as HTMLElement | null;
    moveToTrash(item);
    requestAnimationFrame(() => neighbour?.focus());
  };

  const trashGhostRef = useRef(trashGhost);
  trashGhostRef.current = trashGhost;

  const trashContext = {
    entries: trash,
    builtIn: builtInTrash,
    dropActive: trashDropActive,
    onDragOutCancel: () => setTrashGhost(null),
    onOpen: (id: string, opener: HTMLElement) => activate(id, opener),
    onPutBack: (id: string) => putBack(id),
    onDragOutMove: (id: string, pointer: Position, grab: Position) => {
      const desktop = desktopRef.current!.getBoundingClientRect();
      setTrashGhost({ id, left: pointer.x - grab.x - desktop.left, top: pointer.y - grab.y - desktop.top });
    },
    onDragOutEnd: (id: string, pointer: Position) => {
      const ghost = trashGhostRef.current;
      setTrashGhost(null);
      const layerEl = iconLayerRef.current;
      const hit = document.elementFromPoint(pointer.x, pointer.y);
      // Only bare desktop (or another icon) counts; windows and the dock don't.
      if (!ghost || !layerEl || !hit || !layerEl.contains(hit)) return;
      const layer = layerEl.getBoundingClientRect();
      const desktop = desktopRef.current!.getBoundingClientRect();
      putBack(id, clampToLayer(ghost.left + desktop.left - layer.left, ghost.top + desktop.top - layer.top, layer));
    },
  };

  // Escape: close a frontmost image preview (lightweight, nothing to lose),
  // otherwise clear the desktop selection. Long reads never close on Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const active = manager.activeId ? itemsById.get(manager.activeId) : undefined;
      if (active?.kind === 'image') {
        manager.close(active.id);
        return;
      }
      setSelectedId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Dev-only: persists dragged positions into desktopContent.ts via the
  // save-icon-layout plugin in vite.config.ts, making them the shipped defaults.
  const [layoutStatus, setLayoutStatus] = useState<string | null>(null);
  const saveIconLayout = async () => {
    const rounded = Object.fromEntries(
      Object.entries(iconPositions).map(([id, { x, y }]) => [
        id,
        { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 },
      ]),
    );
    const res = await fetch('/__save-icon-layout', {
      method: 'POST',
      body: JSON.stringify(rounded),
    });
    const { missing } = (await res.json()) as { missing: string[] };
    setLayoutStatus(missing.length ? `Not found: ${missing.join(', ')}` : 'Saved');
    setIconPositions({});
  };

  const runningIds = new Set(manager.windows.filter((w) => w.phase !== 'closing').map((w) => w.id));
  const dockWindowIds = new Set(['about-me', 'notes', 'mail', 'trash']);
  const minimizedItems = manager.windows
    .filter((w) => (w.phase === 'minimized' || w.phase === 'minimizing') && !dockWindowIds.has(w.id))
    .map((w) => itemsById.get(w.id))
    .filter((item): item is DesktopItem => item !== undefined);
  const ghostItem = trashGhost ? itemsById.get(trashGhost.id) : undefined;

  return (
    <TrashContext.Provider value={trashContext}>
      <div className={styles.desktop} ref={desktopRef}>
        <MenuBar />
        <div
          className={styles.iconLayer}
          ref={iconLayerRef}
          onPointerDown={(e) => e.target === e.currentTarget && setSelectedId(null)}
        >
          {visibleItems.map((item) => {
            const position = getIconPosition(item);
            const isAudio = item.kind === 'audio';
            return (
              <DesktopIcon
                key={item.id}
                label={item.label}
                ariaLabel={ariaLabelFor(item, isAudioPlaying)}
                xPercent={position.x}
                yPercent={position.y}
                iconSrc={isAudio ? item.posterSrc : item.iconSrc}
                imagePreview={item.kind === 'image'}
                href={item.kind === 'link' ? item.link?.url : undefined}
                selected={selectedId === item.id}
                exiting={exitingIds.has(item.id)}
                restored={restoredIds.has(item.id)}
                onSelect={() => setSelectedId(item.id)}
                onActivate={(opener) => activate(item.id, opener)}
                onDragMove={(pointer) => setTrashDropActive(item.trashable !== false && isOverTrash(pointer))}
                onDragCancel={() => setTrashDropActive(false)}
                onDrop={(offset, pointer) => handleIconDrop(item, offset, pointer)}
                onTrash={item.trashable === false ? undefined : () => trashFromKeyboard(item)}
                overTrash={trashDropActive}
                playback={isAudio ? { isPlaying: isAudioPlaying } : undefined}
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
        {import.meta.env.DEV && (
          <div className={styles.layoutSaver}>
            {layoutStatus && <span>{layoutStatus}</span>}
            <button
              type="button"
              disabled={Object.keys(iconPositions).length === 0}
              onClick={saveIconLayout}
            >
              Save layout ({Object.keys(iconPositions).length})
            </button>
          </div>
        )}
        <WindowManager
          manager={manager}
          itemsById={itemsById}
          getWorkArea={getWorkArea}
          onOpenItem={openFromContent}
        />
        <Dock
          ref={dockRef}
          runningIds={runningIds}
          minimizedItems={minimizedItems}
          trashCount={trash.length + builtInTrash.length}
          trashDropActive={trashDropActive}
          onOpenWindow={(id, opener) => manager.open(id, opener)}
          onRestore={(id) => manager.open(id)}
        />
        {trashGhost && ghostItem && (
          <DesktopIconGhost
            label={ghostItem.label}
            iconSrc={ghostItem.kind === 'audio' ? ghostItem.posterSrc : ghostItem.iconSrc}
            imagePreview={ghostItem.kind === 'image'}
            left={trashGhost.left}
            top={trashGhost.top}
          />
        )}
      </div>
    </TrashContext.Provider>
  );
}
