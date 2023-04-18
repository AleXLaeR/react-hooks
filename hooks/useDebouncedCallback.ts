import { useState, useEffect } from 'react';

type Timeout = ReturnType<typeof setTimeout>;
type CallbackFunc = (...args: any[]) => void;

type Options = {
  leading?: boolean;
};

export default function useDebouncedCallback<Cb extends CallbackFunc>(
callback: T,
intervalMs: number = 500,
{ leading = false }: Options,
) {
  const latestCallback = useRef<T>(callback);
  const [timerId, setTimerId] = useState<Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
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
      }, delay);

      setTimerId(newTimerId);
    },
    [delay, options, timerId],
  );

  useEffect(() => () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  }, [timerId]);

  return debouncedCallback;
}
