import { useRef, useMemo } from 'react';

type MaybePromise = void | Promise<void>;
type EventHandler<T = any> = (...payload: T[]) => MaybePromise;

type EventType = string | symbol;
type EventMap = { [Key in EventType]: EventHandler };
type EventBus<EMap extends EventMap> = Map<keyof EMap, Set<EMap[keyof EMap]>>;

interface BusHandlers<EMap extends EventMap, Key extends keyof EMap = keyof EMap> {
  subscribe(event: Key, handler: EMap[Key]): () => MaybePromise;

  broadcast(key: Key, ...payload: Parameters<EMap[Key]>): Promise<void>;

  once(key: Key, handler: EMap[Key]): MaybePromise;
}

export default function useEventBus<EMap extends EventMap>(): BusHandlers<EMap> {
  const busRef = useRef<EventBus<EMap>>(new Map());

  const unsubscribe: BusHandlers<EMap>['once'] = (key, handler) => {
    const handlers = busRef.current.get(key);
    if (!handlers) return;

    handlers.delete(handler);
    if (handlers.size === 0) {
      busRef.current.delete(key);
    }
  };

  const subscribe: BusHandlers<EMap>['subscribe'] = (key, handler) => {
    const handlers = busRef.current.get(key);

    if (!handlers) {
      busRef.current.set(key, new Set());
    } else {
      handlers.add(handler);
    }

    return () => unsubscribe(key, handler);
  };

  const once: BusHandlers<EMap>['once'] = (key, handler) => {
    const onceHandler = ((payload) => {
      handler(payload);
      unsubscribe(key, onceHandler);
    }) as typeof handler;

    subscribe(key, onceHandler);
  };

  const broadcast: BusHandlers<EMap>['broadcast'] = async (key, ...payload) => {
    const handlers = busRef.current.get(key);
    if (!handlers) return;

    const promises: Promise<void>[] = [];
    handlers.forEach((callback) => {
      try {
        const result = callback(...payload);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.all(promises);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ subscribe, once, broadcast }), []);
}
