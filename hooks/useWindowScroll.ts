import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

type WindowScrolls = {
  scrollX: number;
  scrollY: number;
};

function getCurrentScroll(): WindowScrolls {
  return { scrollX: window.scrollX, scrollY: window.scrollY };
}

export default function useWindowScroll(debounceInterval?: number): WindowScrolls {
  const [windowScroll, setWindowScroll] = useState(getCurrentScroll());
  const debouncedWindowScroll = useDebounce(windowScroll, debounceInterval);

  const handleResize = useCallback(() => setWindowScroll(getCurrentScroll()), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return debouncedWindowScroll;
}
