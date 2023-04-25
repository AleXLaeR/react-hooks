import { useEffect, useRef, useState } from 'react';

type Timeout = ReturnType<typeof setTimeout>;

export default function useDebounce<T>(
  value: T,
  intervalMs: number = 200,
  skip: boolean = false,
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<Timeout>();

  useEffect(() => {
    if (skip) {
      setDebouncedValue(value);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, intervalMs);

    return () => clearTimeout(timeoutRef.current);
  }, [value, intervalMs, skip]);

  return debouncedValue;
}
