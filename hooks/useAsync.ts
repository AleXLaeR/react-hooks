import { DependencyList, useCallback, useEffect, useState } from 'react';

type AsyncFunc<T> = (...args: any[]) => Promise<T>;

interface UseAsyncState<T> {
  value: T | null;
  loading: boolean;
  error?: string;
  execute: AsyncFunc<T>;
}

function useAsyncFn<T>(func: AsyncFunc<T>, deps: DependencyList = []): UseAsyncState<T> {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string>();

  const execute: AsyncFunc<T> = useCallback(
    async (...args) => {
      setLoading(true);

      try {
        const result = await func(...args);
        setValue(result);

        return result;
      } catch (err: any) {
        setError(err);
        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [func, ...deps],
  );

  return { loading, value, execute, error };
}

function useAsync<T>(
  func: AsyncFunc<T>,
  deps: DependencyList = [],
): Omit<UseAsyncState<T>, 'execute'> {
  const { execute, ...state } = useAsyncFn(func, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export { useAsync, useAsyncFn };
