import { useEffect, useState } from 'react';

export default function useDebounce<T>(
  value: T,
  intervalMs: number = 2e3,
  skip: boolean = false,
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (skip) {
      setDebouncedValue(value);
      return;
    }

    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, intervalMs);
    return () => clearTimeout(timeout);
  }, [value, intervalMs]);

  return debouncedValue;
}
