import { useState, useEffect } from 'react';

export default function useDebouncedState<T>(initial: T, intervalMs: number = 500) {
  const [value, setValue] = useState(initial);
  const [debouncedValue, setDebouncedValue] = useState(initial);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, intervalMs);

    return () => clearTimeout(timeout);
  }, [value, intervalMs]);

  return [debouncedValue, setValue];
}
