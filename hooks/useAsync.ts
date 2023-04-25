import { DependencyList, useCallback, useEffect, useState } from 'react';

type AfterAsyncCallback = (data?: any) => void;
type MaybeAsyncFunc<T> = (...args: any[]) => Promise<T> | T;

type PromiseCallbackState = {
  onResolve?: AfterAsyncCallback;
  onReject?: AfterAsyncCallback;
};

interface UseAsyncState<T> {
  loading: boolean;
  error?: any;
  value: T | null;
  execute: MaybeAsyncFunc<T>;
}

function useAsyncInternal<T>(
  func: MaybeAsyncFunc<T>,
  deps: DependencyList = [],
  initialLoading = true,
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

function isPromise<T>(value: any): value is Promise<T> {
  return value instanceof Promise;
}

function useAsync<T>(
  func: MaybeAsyncFunc<T>,
  deps: DependencyList = [],
  { onResolve, onReject }: PromiseCallbackState = {},
): Omit<UseAsyncState<T>, 'execute'> {
  const { execute, ...state } = useAsyncInternal(func, deps);

  useEffect(() => {
    const result = execute();

    if (isPromise(result) && (onResolve || onReject)) {
      result.then(onResolve).catch(onReject);
    }
  }, [execute, onResolve, onReject]);

  return state;
}

function useAsyncFn<T>(func: MaybeAsyncFunc<T>, deps: DependencyList = []): UseAsyncState<T> {
  return useAsyncInternal(
    func,
    deps,
    false,
  );
}

export { useAsync, useAsyncFn };
