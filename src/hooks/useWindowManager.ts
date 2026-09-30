import { useCallback, useState } from 'react';

// Lifecycle of a window that is logically open. "closing" and "minimizing"
// only last as long as their exit animations; the Window reports back when
// each one finishes.
export type WindowPhase = 'open' | 'closing' | 'minimizing' | 'minimized';

export interface ManagedWindow {
  id: string;
  phase: WindowPhase;
  // Picks the entry animation: a fresh open, or coming back from the dock.
  restored: boolean;
  // Fixed at open time so closing another window never shifts this one.
  cascadeIndex: number;
  // Bumped whenever keyboard focus should move into the window.
  focusToken: number;
  // Where focus returns once the window closes.
  opener: HTMLElement | null;
}

interface WindowState {
  windows: ManagedWindow[];
  // Front-to-back order lives here; the last id is frontmost.
  stack: string[];
}

export const WINDOW_Z_BASE = 10;

function toFront(stack: string[], id: string): string[] {
  return stack[stack.length - 1] === id ? stack : [...stack.filter((s) => s !== id), id];
}

function update(state: WindowState, id: string, patch: (w: ManagedWindow) => Partial<ManagedWindow>) {
  return state.windows.map((w) => (w.id === id ? { ...w, ...patch(w) } : w));
}

export function useWindowManager() {
  const [state, setState] = useState<WindowState>({ windows: [], stack: [] });

  // Opening an item that's already open never duplicates it: it restores a
  // minimized window (or rescues one mid-close) and brings it to the front.
  const open = useCallback((id: string, opener: HTMLElement | null = null) => {
    setState((prev) => {
      const existing = prev.windows.find((w) => w.id === id);
      if (existing) {
        return {
          windows: update(prev, id, (w) => ({
            phase: 'open',
            restored: w.phase === 'minimized' || w.phase === 'minimizing' ? true : w.restored,
            focusToken: w.focusToken + 1,
          })),
          stack: toFront(prev.stack, id),
        };
      }
      return {
        windows: [
          ...prev.windows,
          { id, phase: 'open', restored: false, cascadeIndex: prev.windows.length, focusToken: 1, opener },
        ],
        stack: [...prev.stack, id],
      };
    });
  }, []);

  const focus = useCallback((id: string) => {
    setState((prev) => {
      const stack = toFront(prev.stack, id);
      return stack === prev.stack ? prev : { ...prev, stack };
    });
  }, []);

  const close = useCallback((id: string) => {
    setState((prev) => ({ ...prev, windows: update(prev, id, () => ({ phase: 'closing' })) }));
  }, []);

  const minimize = useCallback((id: string) => {
    setState((prev) => ({ ...prev, windows: update(prev, id, () => ({ phase: 'minimizing' })) }));
  }, []);

  // Called once the close animation ends. Focus goes back to whatever opened
  // the window, but only if it was still inside the window — never stolen
  // from something the visitor has since moved on to.
  const finishClose = (id: string, hadFocus: boolean) => {
    const closing = state.windows.find((w) => w.id === id);
    if (!closing || closing.phase !== 'closing') return;
    setState((prev) =>
      prev.windows.find((w) => w.id === id)?.phase !== 'closing'
        ? prev
        : {
            windows: prev.windows.filter((w) => w.id !== id),
            stack: prev.stack.filter((s) => s !== id),
          },
    );
    if (hadFocus && closing.opener?.isConnected) closing.opener.focus({ preventScroll: true });
  };

  // Called once the minimize animation ends. If the window held focus, it
  // hands over to the next visible window, like a desktop would.
  const finishMinimize = useCallback((id: string, hadFocus: boolean) => {
    setState((prev) => {
      if (prev.windows.find((w) => w.id === id)?.phase !== 'minimizing') return prev;
      const nextId = [...prev.stack]
        .reverse()
        .find((s) => s !== id && prev.windows.find((w) => w.id === s)?.phase === 'open');
      return {
        ...prev,
        windows: prev.windows.map((w) =>
          w.id === id
            ? { ...w, phase: 'minimized' as const }
            : hadFocus && w.id === nextId
              ? { ...w, focusToken: w.focusToken + 1 }
              : w,
        ),
      };
    });
  }, []);

  const activeId =
    [...state.stack].reverse().find((id) => state.windows.find((w) => w.id === id)?.phase === 'open') ??
    null;

  const zIndexOf = (id: string) => WINDOW_Z_BASE + state.stack.indexOf(id);

  return {
    windows: state.windows,
    activeId,
    zIndexOf,
    open,
    focus,
    close,
    minimize,
    finishClose,
    finishMinimize,
  };
}
