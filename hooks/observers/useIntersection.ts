import { RefObject, useEffect, useState } from 'react';
import useDebounce from '../useDebounce';

type UseElementOnScreenOptions = IntersectionObserverInit & {
  debounceIntervalMs?: number;
};

export default function useIntersection<El extends HTMLElement>(
  ref: RefObject<El>,
  { rootMargin = '0px', debounceIntervalMs = 500, ...rest }: UseElementOnScreenOptions
) {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const debouncedIsIntersecting = useDebounce(isIntersecting, debounceIntervalMs);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        setIsIntersecting(isIntersecting);
      },
      { rootMargin, ...rest }
    );

    if (ref?.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref?.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]);

  return debouncedIsIntersecting;
}
