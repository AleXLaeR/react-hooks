import { RefObject, useCallback, useEffect, useRef } from 'react';
import useDebouncedState from './useDebouncedState';

type UseInViewOptions = IntersectionObserverInit & {
  debounceIntervalMs?: number;
  approximationDelta?: number;
  triggerOnce?: boolean;
};

type UseInViewReturnType = [
  ref: RefObject<HTMLElement>,
  isIntersecting: boolean,
  isFullyVisible: boolean,
];

export default function useInView({
  rootMargin = '0px',
  debounceIntervalMs = 200,
  triggerOnce = false,
  approximationDelta = 0,
  ...rest
}: UseInViewOptions): UseInViewReturnType {
  const [intersecting, setIntersecting] = useDebouncedState(false, debounceIntervalMs);
  const [isFullyVisible, setIsFullyVisible] = useDebouncedState(false, debounceIntervalMs);

  const ref = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handler: IntersectionObserverCallback = useCallback(
    ([{ isIntersecting, intersectionRatio }]) => {
      setIntersecting(isIntersecting);
      setIsFullyVisible(intersectionRatio >= 1 - approximationDelta);

      if (triggerOnce && isIntersecting) {
        observerRef.current?.unobserve(ref.current!);
      }
    },
    [triggerOnce],
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handler, { rootMargin, ...rest });

    if (ref.current) {
      observerRef.current?.observe(ref.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin, handler]);

  return [ref, intersecting, isFullyVisible];
}
