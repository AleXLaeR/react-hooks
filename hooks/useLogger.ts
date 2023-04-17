import useEffectOnce from './onFirst/useEffectOnce';
import useUpdateEffect from './onFirst/useUpdateEffect';

type LoggerFunc = (...args: any[]) => void;

export default function useLogger<T extends string>(
  keyName: NonNullable<T>,
  logger: LoggerFunc,
  ...rest: any[]
) {
  const logMethod = logger ?? console.log;

  useEffectOnce(() => {
    logMethod(`${keyName} mounted`, ...rest);
    return () => logMethod(`${keyName} unmounted`);
  });

  useUpdateEffect(() => {
    logMethod(`${keyName} updated`, ...rest);
  });
};
