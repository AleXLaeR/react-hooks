import { DependencyList, useEffect, useRef } from 'react';

type Timeout = ReturnType<typeof setTimeout>;

export default function useTimeout(
  callback: () => void,
  delay: number = 1e3,
  deps: DependencyList = [],
): void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay <= 0) return;

    const tick = () => callbackRef.current();
    timeoutRef.current = setTimeout(tick, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [delay, deps]);
}
