// src/hooks/useSessionTimeout.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onLogout: () => void;
  enabled?: boolean;
}

export const useSessionTimeout = ({
  timeoutMinutes = 10,
  warningMinutes = 1,
  onLogout,
  enabled = true,
}: UseSessionTimeoutOptions) => {
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reset the timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    setTimeRemaining(timeoutMinutes * 60);
    onClose();

    // Clear existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    // Start the countdown timer
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - lastActivityRef.current) / 1000;
      const remaining = Math.max(0, timeoutMinutes * 60 - elapsed);
      setTimeRemaining(remaining);

      // Show warning when 1 minute remaining
      if (remaining <= warningMinutes * 60 && !warningShownRef.current && remaining > 0) {
        warningShownRef.current = true;
        onOpen();
      }

      // Logout when time is up
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onClose();
        onLogout();
      }
    }, 1000);
  }, [timeoutMinutes, warningMinutes, onLogout, onOpen, onClose]);

  // Extend session (reset timer)
  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Track user activity
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      // If warning is open, close it and reset
      if (warningShownRef.current) {
        warningShownRef.current = false;
        onClose();
        resetTimer();
      }
    };

    // List of events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel',
      'pointerdown',
    ];

    // Throttle mousemove to reduce performance impact
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledHandler = (e: Event) => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        handleActivity();
        throttleTimeout = null;
      }, 1000);
    };

    events.forEach((event) => {
      if (event === 'mousemove') {
        document.addEventListener(event, throttledHandler);
      } else {
        document.addEventListener(event, handleActivity);
      }
    });

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      events.forEach((event) => {
        if (event === 'mousemove') {
          document.removeEventListener(event, throttledHandler);
        } else {
          document.removeEventListener(event, handleActivity);
        }
      });
    };
  }, [enabled, resetTimer, onClose]);

  return {
    timeRemaining,
    isWarningOpen: isOpen,
    extendSession,
    closeWarning: onClose,
  };
};