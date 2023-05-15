import { RefObject, useState, useEffect, useRef, useCallback } from 'react';
import useDebouncedState from './useDebouncedState';

interface UseVirtualListOptions {
  itemHeight: number;
  overScan?: number;
  debounceIntervalMs?: number;
}

type UseVirtualListReturnType<T> = readonly [
  containerRef: RefObject<HTMLElement>,
  listToRender: NonNullable<T>[],
  scrollTo: (index: number) => void,
];

export default function useVirtualList<T>(
  initialList: NonNullable<T>[],
  { itemHeight, overScan = 5, debounceIntervalMs = 100 }: UseVirtualListOptions,
): UseVirtualListReturnType<T> {
  const [visibleItems, setVisibleItems] = useState<NonNullable<T>[]>([]);
  const [scrollTop, setScrollTop] = useDebouncedState(0, debounceIntervalMs);

  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.clientHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);

    const start = Math.floor(scrollTop / itemHeight);
    const end = start + visibleCount + overScan * 2;

    setVisibleItems(initialList.slice(start, end));
  }, [initialList, itemHeight, overScan, scrollTop]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      const top = index * itemHeight;

      containerRef.current.scrollTop = top;
      setScrollTop(top);
    },
    [itemHeight],
  );

  return [containerRef, visibleItems, scrollTo] as const;
}
