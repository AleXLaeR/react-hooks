import { useRef, useEffect, DependencyList } from 'react';

type Interval = ReturnType<typeof setInterval>;

export default function useInterval(
  callback: () => void,
  delay: number = 1e3,
  deps: DependencyList = [],
): void {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<Interval>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay <= 0) return;

    const tick = () => callbackRef.current();
    intervalRef.current = setInterval(tick, delay);

    return () => clearInterval(intervalRef.current);
  }, [delay, deps]);
}
