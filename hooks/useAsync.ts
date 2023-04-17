import { DependencyList, useCallback, useEffect, useState } from 'react';

type UseAsyncState<T> = {
  loading: boolean;
  error?: any;
  value: T | null;
  execute: (...args: any[]) => Promise<T>;
};

type AsyncFunc<T> = (...args: any[]) => Promise<T>;

function useAsyncInternal<T>(
  func: AsyncFunc<T>,
  deps: DependencyList = [],
  initialLoading = true
): UseAsyncState<T> {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<any>();
  const [value, setValue] = useState<T | null>(null);

  const execute = useCallback(async (...params: any[]) => {
    setLoading(true);

    try {
      const data = await func(...params);

      setValue(data);
      setError(null);

      return data;
    } catch (error: any) {
      setError(error);
      setValue(null);

      return Promise.reject(error);
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { loading, error, value, execute };
}

function useAsync<T>(func: AsyncFunc<T>, deps: DependencyList = [], cb?: () => void) {
  const { execute, ...state } = useAsyncInternal(func, deps);

  useEffect(() => {
    execute().then(cb);
  }, [cb, execute]);

  return state;
}

function useAsyncFn<T>(func: AsyncFunc<T>, deps: DependencyList = []) {
  return useAsyncInternal(
    func,
    deps,
    false,
  );
}

export { useAsync, useAsyncFn };
