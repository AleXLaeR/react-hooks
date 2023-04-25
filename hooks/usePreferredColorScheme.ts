import { useState, useEffect, useCallback } from 'react';

type ColorScheme = 'light' | 'dark';

function isDarkThemePreferred() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
}

export default function usePreferredColorScheme(): ColorScheme {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return isDarkThemePreferred().matches ? 'dark' : 'light';
  });

  const onSchemeChange = useCallback((event: MediaQueryListEvent) => {
    setColorScheme(event.matches ? 'dark' : 'light');
  } ,[]);

  useEffect(() => {
    const mediaQuery = isDarkThemePreferred();
    mediaQuery.addEventListener('change', onSchemeChange);

    return () => mediaQuery.removeEventListener('change', onSchemeChange);
  }, []);

  return colorScheme;
}
