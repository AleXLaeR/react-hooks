import { useEffect, useState } from 'react';

type MediaDirection = 'min-width' | 'max-width';
type SafeNumber = number | string;

export default function useMediaQuery(
  direction: MediaDirection = 'min-width',
  value: SafeNumber,
  unit = 'px',
): boolean {
  const [matchesQuery, setMatchesQuery] = useState(false);

  useEffect(() => {
    let parsedValue = value;
    if (typeof value === 'string') {
      parsedValue = value.replace(unit, '');
    }

    const mediaList = window.matchMedia(`(${direction}: ${parsedValue}${unit})`);
    setMatchesQuery(mediaList.matches);

    const updateMatches = ({ matches }: MediaQueryListEvent) => setMatchesQuery(matches);
    mediaList.addEventListener('change', updateMatches);

    return () => mediaList.removeEventListener('change', updateMatches);
  }, [matchesQuery, value, direction, unit]);

  return matchesQuery;
};
