import { useState, useEffect, useRef } from 'react';
import useDebouncedState from './useDebouncedState';

export default function useParentHeight(debounceIntervalMs: number = 100): number {
  const [height, setHeight] = useDebouncedState(0, debounceIntervalMs);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        setHeight(contentRect.height);
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.unobserve(ref.current!);
      };
    }
  }, []);

  return height;
}
