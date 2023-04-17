import { useEffect } from 'react';

export default function useUnmount(callback?: () => void) {
  useEffect(() => () => {
    if (callback) callback();
  }, []);
}
