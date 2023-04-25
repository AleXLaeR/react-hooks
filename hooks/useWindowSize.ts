import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

type WindowMeasurements = {
  width: number;
  height: number;
};

function getCurrentMeasurements(): WindowMeasurements {
  return { width: window.innerWidth, height: window.innerHeight };
}

export default function useWindowSize(debounceInterval?: number) {
  const [windowSize, setWindowSize] = useState(getCurrentMeasurements());
  const debouncedWindowSize = useDebounce(windowSize, debounceInterval);

  const handleResize = useCallback(() => setWindowSize(getCurrentMeasurements()), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return debouncedWindowSize;
}
