import { useCallback, useRef } from "react";

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

export function useHorizontalSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  options?: { threshold?: number; maxVertical?: number }
): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);
  const threshold = options?.threshold ?? 48;
  const maxVertical = options?.maxVertical ?? 80;

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

      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > maxVertical && Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
    [maxVertical, onSwipeLeft, onSwipeRight, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
