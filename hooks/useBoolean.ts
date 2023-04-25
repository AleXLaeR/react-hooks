import { useMemo, useState } from 'react';

type UseBooleanAction = 'enable' | 'disable' | 'toggle' | 'reset';

type UseBooleanHandlers = {
  [K in UseBooleanAction]: () => void;
};

type UseBooleanReturnType = [
  toggleState: boolean,
  handlers: UseBooleanHandlers,
];

export default function useBoolean(initialState: boolean = false): UseBooleanReturnType {
  const [toggleState, setToggleState] = useState(initialState);

  const handlers = useMemo(
    () => ({
      enable: () => setToggleState(true),
      disable: () => setToggleState(false),
      toggle: () => setToggleState((prev) => !prev),
      reset: () => setToggleState(initialState),
    }),
    [initialState],
  );

  return [toggleState, handlers];
}
