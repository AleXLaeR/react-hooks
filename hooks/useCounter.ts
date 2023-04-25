import { useState, useMemo } from "react";

type UseCounterAction = 'increment' | 'decrement' | 'reset';

type UseCounterHandlers = {
  [K in UseCounterAction]: () => void;
};

type UseCounterReturnType = [
  count: number,
  handlers: UseCounterHandlers,
];

export default function useCounter(
  initialCount: number = 0,
  step: number = 1,
): UseCounterReturnType {
  const [count, setCount] = useState(initialCount);

  const actions = useMemo(
    () => ({
      increment: () => setCount((c) => c + step),
      decrement: () => setCount((c) => c - step),
      reset: () => setCount(initialCount),
    }),
    [initialCount, step],
  );

  return [count, actions];
}
