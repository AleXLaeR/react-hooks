import { useState, useEffect, useRef, useCallback } from 'react';

type Timeout = ReturnType<typeof setTimeout>;
type CallbackFunc = (...args: any[]) => void;

type Options = {
  leading?: boolean;
};

type CallbackReturnType<T extends CallbackFunc> = (...args: Parameters<T>) => void;

export default function useDebouncedCallback<Cb extends CallbackFunc>(
  callback: Cb,
  intervalMs: number = 500,
  { leading = false }: Options,
): CallbackReturnType<Cb> {
  const latestCallback = useRef(callback);
  const [timerId, setTimerId] = useState<Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<Cb>) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      if (leading && !timerId) {
        latestCallback.current(...args);
      }

      const newTimerId = setTimeout(() => {
        if (!leading) {
          latestCallback.current(...args);
        }
      }, intervalMs);

      setTimerId(newTimerId);
    },
    [intervalMs, timerId],
  );

  useEffect(() => () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  }, [timerId]);

  return debouncedCallback;
}
