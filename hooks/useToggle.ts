import { useMemo, useState } from 'react';

export default function useToggle(initialState = false) {
  const [toggle, setToggle] = useState(initialState);

  const handlers = useMemo(
    () => ({
      on: () => setToggle(true),
      off: () => setToggle(false),
      toggle: () => setToggle((prev) => !prev),
      reset: () => setToggle(initialState),
    }),
    [initialState],
  );

  return { toggleState: toggle, handlers };
}
