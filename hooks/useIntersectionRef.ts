import { RefObject, useEffect, useState, useCallback } from 'react';
import useDebounce from './useDebounce';

type UseElementOnScreenOptions = IntersectionObserverInit & {
  debounceIntervalMs?: number;
  triggerOnce?: boolean;
};

interface UseIntersectionResult {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
}

export default function useIntersectionRef({
  rootMargin = '0px',
  debounceIntervalMs = 200,
  triggerOnce = false,
  ...rest
}: UseElementOnScreenOptions): UseIntersectionResult {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const debouncedIsIntersecting = useDebounce(isIntersecting, debounceIntervalMs);
  
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
    
  const handleIntersect: IntersectionObserverCallback = useCallback(
    ([{ isIntersecting }]) => {
      setIsIntersecting(isIntersecting);
      if (triggerOnce && isIntersecting) {
        observerRef.current?.unobserve(ref.current!);
      }
    },
    [triggerOnce],
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, { rootMargin, ...rest });

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [rootMargin, handleIntersect]);

  return { ref, isIntersecting: debouncedIsIntersecting };
}
