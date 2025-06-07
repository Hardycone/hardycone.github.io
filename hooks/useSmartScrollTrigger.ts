import { useEffect, useRef } from "react";

export function useSmartScrollTrigger({
  callback,
  sensitivity = 10,
  minInterval = 100,
  directionResetDelay = 300,
}: {
  callback: (direction: 1 | -1) => void;
  sensitivity?: number;
  minInterval?: number; // Minimum time between triggers
  directionResetDelay?: number; // How long to reset direction memory
}) {
  const lastTriggerTime = useRef(0);
  const lastDirection = useRef<1 | -1 | null>(null);
  const directionResetTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < sensitivity) return;

      const now = Date.now();
      const direction = e.deltaY > 0 ? 1 : -1;

      const timeSinceLastTrigger = now - lastTriggerTime.current;

      // Reset direction streak if time has passed or direction changed
      if (direction !== lastDirection.current) {
        if (directionResetTimer.current)
          clearTimeout(directionResetTimer.current);
        directionResetTimer.current = setTimeout(() => {
          lastDirection.current = null;
        }, directionResetDelay);
      }

      if (
        lastDirection.current !== direction || // Changed direction
        timeSinceLastTrigger > minInterval // Or waited long enough
      ) {
        lastTriggerTime.current = now;
        lastDirection.current = direction;
        callback(direction);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [callback, sensitivity, minInterval, directionResetDelay]);
}
