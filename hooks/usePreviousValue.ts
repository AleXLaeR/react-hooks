import { useRef, useEffect } from 'react';

export default function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}