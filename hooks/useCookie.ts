import { useCallback, useState } from 'react';
import { get, set, remove, CookieAttributes } from 'js-cookie';

type UseCookieReturnType = [
  string | null,
  (newValue: string, options?: CookieAttributes) => void,
  () => void,
];

export default function useCookie(cookieName: string): UseCookieReturnType {
  const [value, setValue] = useState<string | null>(
    () => get(cookieName) ?? null,
  );

  const updateCookie = useCallback(
    (newValue: string, options?: CookieAttributes) => {
      set(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName],
  );

  const deleteCookie = useCallback(() => {
    remove(cookieName);
    setValue(null);
  }, [cookieName]);

  return [value, updateCookie, deleteCookie];
}
