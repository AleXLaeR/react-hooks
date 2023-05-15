import { useState, useEffect, useCallback, useRef } from 'react';

type Timeout = ReturnType<typeof setTimeout>;
type EqPredicate<T> = (a: T, b: T) => boolean;

function defaultEquals<T>(f: T, s: T) {
  return f === s;
}

type UseDebouncedStateReturnType<T> = readonly [T, (v: T) => void];

export default function useDebouncedState<State>(
  initial: State,
  intervalMs: number = 500,
  isEqual: EqPredicate<State> = defaultEquals,
): UseDebouncedStateReturnType<State> {
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

  const setDebouncedState = useCallback(
    (newValue: State) => {
      if (!isEqual(newValue, value)) {
        setValue(newValue);
      }
    },
    [value, isEqual],
  );

  return [debouncedValue, setDebouncedState] as const;
}
