import { useCallback, useRef } from "react";

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

export function useVerticalSwipe(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  options?: { threshold?: number; maxHorizontal?: number }
): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);
  const threshold = options?.threshold ?? 48;
  const maxHorizontal = options?.maxHorizontal ?? 80;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    start.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!start.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      start.current = null;

      if (Math.abs(dy) < threshold) return;
      if (Math.abs(dx) > maxHorizontal && Math.abs(dx) > Math.abs(dy)) return;

      if (dy < 0) onSwipeUp();
      else onSwipeDown();
    },
    [maxHorizontal, onSwipeDown, onSwipeUp, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
