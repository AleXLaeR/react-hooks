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

    const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight));
    const endIdx = Math.min(initialList.length, startIdx + visibleCount + overScan * 2);

    setVisibleItems(initialList.slice(startIdx, endIdx));
  }, [initialList, itemHeight, overScan, scrollTop]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      setScrollTop(containerRef.current!.scrollTop);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
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
