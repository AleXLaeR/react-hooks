import { RefObject, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const containerRef = useRef<HTMLElement | null>(null);
  const [scrollTop, setScrollTop] = useDebouncedState(0, debounceIntervalMs);

  const visibleItems: NonNullable<T>[] = useMemo(() => {
    if (!containerRef.current) return [];

    const containerHeight = containerRef.current.clientHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIdx = Math.floor(scrollTop / itemHeight);
    const endIdx = startIdx + visibleCount + overScan * 2;

    return initialList.slice(startIdx, Math.min(initialList.length, endIdx));
  }, [initialList, itemHeight, overScan, scrollTop]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    setScrollTop(containerRef.current.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      const maxScrollTop = Math.max(
        0,
        (initialList.length - 1) * itemHeight - containerRef.current.clientHeight,
      );
      const targetScrollTop = Math.min(index * itemHeight, maxScrollTop);

      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
      setScrollTop(targetScrollTop);
    },
    [itemHeight, initialList],
  );

  return [containerRef, visibleItems, scrollTo] as const;
}
