import { useCallback, useEffect, useRef } from 'react';

type Timeout = ReturnType<typeof setTimeout>;
type SleepActivator = (forMs: number) => Promise<void>;

export default function useSleep(): SleepActivator {
  const timeoutRefs = useRef<Timeout[]>([]);

  useEffect(() => () => {
      timeoutRefs.current.forEach(clearTimeout);
  }, []);

  return useCallback((forMs: number) => (
    new Promise<void>((resolve) => {
      const timeoutId = setTimeout(() => {
        timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId);
        resolve();
      }, forMs);

      timeoutRefs.current.push(timeoutId);
    })
  ), []);
}