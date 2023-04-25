import { useCallback, useEffect, useState } from 'react';

type SafeNumber = string | number;

interface UseStorageInternalParams {
  key: string;
  defValue?: SafeNumber | ((key?: string) => SafeNumber);
  storage?: Storage;
}

function useStorageInternal({
  key,
  defValue,
  storage = window.localStorage,
}: UseStorageInternalParams) {
  const [value, setValue] = useState(() => {
    const jsonValue = storage.getItem(key);

    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }

    return defValue instanceof Function ? defValue(key) : defValue;
  });

  useEffect(() => {
    if (value === undefined) {
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, JSON.stringify(value));
  }, [key, value, storage]);

  const removeValue = useCallback(() => setValue(undefined), []);

  return { value, setValue, removeValue };
}

function useLocalStorage({ key, defValue }: UseStorageInternalParams) {
  return useStorageInternal({ key, defValue });
}

function useSessionStorage({ key, defValue }: UseStorageInternalParams) {
  return useStorageInternal({
    key,
    defValue,
    storage: window.sessionStorage,
  });
}

export { useLocalStorage, useSessionStorage };
