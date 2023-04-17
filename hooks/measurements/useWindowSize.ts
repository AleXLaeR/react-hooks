import { useEffect, useState } from 'react';
import useDebounce from '../useDebounce';

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

  useEffect(() => {
    function handleResize() {
      setWindowSize(getCurrentMeasurements());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return debouncedWindowSize;
}
