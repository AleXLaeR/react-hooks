import { RefObject, useCallback, useEffect, useRef } from 'react';

export default function useClickOutside<El extends HTMLElement>(
  elemRef: RefObject<El>,
  handler: (e: Event) => void,
  parentRef?: RefObject<El>,
): void {
  const handlerRef = useRef(handler);

  const listener = useCallback(
    (event: Event) => {
      const nodeTarget = event.target as Node;

      if (parentRef && !parentRef.current?.contains(nodeTarget)) {
        return;
      }
      if (!elemRef.current || elemRef.current.contains(nodeTarget)) {
        return;
      }

      handlerRef.current(event);
    },
    [parentRef, elemRef],
  );

  useEffect(() => {
    window.addEventListener('mouseup', listener);
    window.addEventListener('touchstart', listener);

    return () => {
      window.removeEventListener('mouseup', listener);
      window.removeEventListener('touchstart', listener);
    };
  });
}
