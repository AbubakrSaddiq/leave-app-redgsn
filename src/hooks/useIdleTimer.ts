// ============================================
// useIdleTimer Hook
// Detects user inactivity and fires a callback
// after a configured period of no interaction
// ============================================

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

// Ignore rapid-fire activity (e.g. mousemove) within this window
// to avoid resetting the timer on every pixel of movement
const THROTTLE_MS = 1000;

interface UseIdleTimerOptions {
  timeout: number; // ms of inactivity before onIdle fires
  onIdle: () => void;
  events?: string[];
  enabled?: boolean;
}

export function useIdleTimer({
  timeout,
  onIdle,
  events = DEFAULT_EVENTS,
  enabled = true,
}: UseIdleTimerOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastActivityRef = useRef<number>(Date.now());
  const onIdleRef = useRef(onIdle);

  // Keep the latest callback without re-binding listeners
  onIdleRef.current = onIdle;

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!enabled) return;
    timerRef.current = setTimeout(() => onIdleRef.current(), timeout);
  }, [timeout, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < THROTTLE_MS) return;
      lastActivityRef.current = now;
      reset();
    };

    reset();
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, timeout]);

  return { reset };
}

export default useIdleTimer;