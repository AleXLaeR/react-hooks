import { useState } from 'react';

type UpdateInitiator = () => void;

export default function useForceUpdate(): UpdateInitiator {
  const [, setValue] = useState(0);
  return () => setValue((prev) => prev + 1);
}
