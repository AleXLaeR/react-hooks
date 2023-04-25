import { useState, useEffect, useCallback, useRef } from 'react';

type UseDebouncedStateOptions<T> = {
  intervalMs?: number;
  isEqual?: (a: T, b: T) => boolean;
}

type Timeout = ReturnType<typeof setTimeout>;

function defaultEquals<T>(f: T, s: T) {
  return f === s;
}

export default function useDebouncedState<State>(
  initial: State,
  { intervalMs = 500, isEqual = defaultEquals }: UseDebouncedStateOptions<State>,
) {
  const [value, setValue] = useState(initial);
  const [debouncedValue, setDebouncedValue] = useState(initial);
  const timeoutRef = useRef<Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, intervalMs);

    return () => clearTimeout(timeoutRef.current);
  }, [value, intervalMs]);

  const setDebouncedState = useCallback((newValue: State) => {
    if (!isEqual(newValue, value)) {
      setValue(newValue);
    }
  }, [value, isEqual]);

  return [debouncedValue, setDebouncedState] as const;
}
