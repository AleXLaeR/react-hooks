import { useCallback, useState } from 'react';
import cookies from 'js-cookie';

export default function useCookie(
  cookieName: string
): [string | null, (newValue: string, options?: cookies.CookieAttributes) => void, () => void] {
  const [value, setValue] = useState<string | null>(
    () => cookies.get(cookieName) ?? null
  );

  const updateCookie = useCallback(
    (newValue: string, options?: cookies.CookieAttributes) => {
      cookies.set(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName],
  );

  const deleteCookie = useCallback(() => {
    cookies.remove(cookieName);
    setValue(null);
  }, [cookieName]);

  return [value, updateCookie, deleteCookie];
}
