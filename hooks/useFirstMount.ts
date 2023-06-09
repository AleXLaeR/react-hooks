import { useRef } from 'react';

export default function useFirstMount(callback?: () => void): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    if (callback) callback();
    return true;
  }

  return isFirst.current;
}
