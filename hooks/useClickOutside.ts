import { RefObject, useCallback, useEffect, useRef } from 'react';

export default function useClickOutside<Element extends HTMLElement = HTMLElement>(
  elemRef: RefObject<Element>,
  handler: (e: Event) => void
) {
  const handlerRef = useRef(handler);

  const listener = useCallback((event: Event) => {
    const nodeTarget = event.target as Node;
    if (!elemRef.current || elemRef.current.contains(nodeTarget)) {
      return;
    }

    handlerRef.current(event);
  }, [elemRef]);

  useEffect(() => {
   document.addEventListener('mousedown', listener);
   document.addEventListener('touchstart', listener);

   return () => {
     document.removeEventListener('mousedown', listener);
     document.removeEventListener('touchstart', listener);
   };
  }, [listener]);
}
