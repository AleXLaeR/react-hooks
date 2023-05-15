import { RefObject, useCallback, useEffect, useRef } from 'react';

type EventCallback = (e?: Event) => void;

export default function useClickOutside<El extends HTMLElement>(
  elemRef: RefObject<El>,
  callback: EventCallback,
  parentRef?: RefObject<El>,
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handler = useCallback(
    (event: Event) => {
      const nodeTarget = event.target as Node;

      if (parentRef?.current && !parentRef.current.contains(nodeTarget)) {
        return;
      }
      if (!elemRef.current || elemRef.current.contains(nodeTarget)) {
        return;
      }

      callbackRef.current(event);
    },
    [elemRef, parentRef],
  );

  useEffect(() => {
    window.addEventListener('mouseup', handler);
    window.addEventListener('touchstart', handler);

    return () => {
      window.removeEventListener('mouseup', handler);
      window.removeEventListener('touchstart', handler);
    };
  });
}
