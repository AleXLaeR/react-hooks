import { useState } from 'react';

export default function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((prev) => prev + 1);
}
