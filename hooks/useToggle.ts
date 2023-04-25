import { useMemo, useState } from 'react';

type UseToggleAction = 'enable' | 'disable' | 'toggle';

type UseToggleHandlers = {
  [K in UseToggleAction]: () => void;
};

type UseToggleReturnType<T> = [
  toggleState: T,
  handlers: UseToggleHandlers,
];

export default function useToggle<T>(firstValue: T, secondValue: T): UseToggleReturnType<T> {
  const [toggleState, setToggleState] = useState<T>(firstValue);

  const handlers: UseToggleHandlers = useMemo(
    () => ({
      enable: () => setToggleState(firstValue),
      disable: () => setToggleState(secondValue),
      toggle: () => setToggleState((prev) => prev === firstValue ? secondValue : firstValue),
    }),
    [firstValue, secondValue],
  );

  return [toggleState, handlers];
}
