import { useEffect, useRef } from 'react';

type BindingElement = Element | typeof window;
type EventType = keyof ElementEventMap | keyof WindowEventMap | keyof DocumentEventMap;

export default function useEventListener<E extends Event, ET extends EventType>(
  eventType: ET,
  callback: (event: E) => void,
  on: BindingElement = window,
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: Event) => callbackRef.current(e as E);
    if (on && 'addEventListener' in on) {
      on.addEventListener(eventType, handler);
    }

    return () => on.removeEventListener(eventType, handler);
  }, [on, eventType]);
}
