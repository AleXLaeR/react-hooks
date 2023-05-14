import { DependencyList, useCallback, useEffect, useState } from 'react';

type MaybeAsyncFunc<T> = (...args: any[]) => Promise<T> | T;

interface UseAsyncState<T> {
  value: T | null;
  loading: boolean;
  error?: string;
  execute: (...args: any[]) => Promise<T>;
}

function useAsyncInternal<T>(func: MaybeAsyncFunc<T>, deps: DependencyList = []): UseAsyncState<T> {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);

      try {
        const result = await func(...args);
        setValue(result);
        return result;
      } catch (err: any) {
        setError(err);
        return await Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [func, ...deps],
  );

  return { value, loading, error, execute };
}

function useAsync<T>(
  func: MaybeAsyncFunc<T>,
  deps: DependencyList = [],
): Omit<UseAsyncState<T>, 'execute'> {
  const { execute, ...state } = useAsyncInternal(func, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

function useAsyncFn<T>(func: MaybeAsyncFunc<T>, deps: DependencyList = []): UseAsyncState<T> {
  return useAsyncInternal(func, deps);
}

export { useAsync, useAsyncFn };
