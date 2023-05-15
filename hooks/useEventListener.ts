import { useEffect, useRef } from 'react';

type EventType = keyof ElementEventMap | keyof WindowEventMap | keyof DocumentEventMap;

type EventCallback<E extends Event = Event> = (e: E) => void;
type EventBindingElement = HTMLElement | typeof window | typeof document;

export default function useEventListener<E extends Event, EType extends EventType>(
  eventType: EType,
  callback: EventCallback<E>,
  on: EventBindingElement = window,
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
