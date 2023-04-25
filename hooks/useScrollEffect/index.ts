import { DependencyList, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import type { ElementRefOrDefault, ScrollProps } from './types';
import getScrollPosition, { isBrowser } from './utils';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

type UseScrollOptions = {
  throttleIntervalMs: number;
  element?: ElementRefOrDefault;
  useWindow: boolean;
  boundingElement?: ElementRefOrDefault;
};

export default function useScrollEffect(
  effect: (props: ScrollProps) => void,
  deps: DependencyList = [],
  { throttleIntervalMs = 500, useWindow = false, element, boundingElement }: UseScrollOptions,
) {
  const position = useRef(getScrollPosition(
    {
      useWindow,
      boundingElement,
    },
  ));

  let timeoutRef: ReturnType<typeof setTimeout> | null = null;

  const callback = useCallback(() => {
    const currentPos = getScrollPosition({
      element,
      useWindow,
      boundingElement,
    });

    effect({ previousPos: position.current, currentPos });

    position.current = currentPos;
    timeoutRef = null;
  }, [effect, element, boundingElement, useWindow]);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleScroll = useCallback(() => {
      if (throttleIntervalMs) {
        if (timeoutRef === null) {
          timeoutRef = setTimeout(callback, throttleIntervalMs);
        }
      } else if (!timeoutRef) {
        callback();
      }
    }, [timeoutRef, throttleIntervalMs]);

    if (boundingElement) {
      boundingElement.current?.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (boundingElement) {
        boundingElement.current?.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }

      if (timeoutRef !== null) {
        clearTimeout(timeoutRef);
      }
    };
  }, deps);
};
