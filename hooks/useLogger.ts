import useEffectOnce from './useEffectOnce';
import useUpdateEffect from './useUpdateEffect';

type LoggerFunc = (...args: any[]) => void;
type LoggerArgs = Parameters<LoggerFunc>;

export default function useLogger<T extends string>(
  keyName: NonNullable<T>,
  logger: LoggerFunc = console.log,
  ...rest: LoggerArgs[]
) {
  useEffectOnce(() => {
    logger(`${keyName} mounted`, ...rest);
    return () => logger(`${keyName} unmounted`);
  });

  useUpdateEffect(() => {
    logger(`${keyName} updated`, ...rest);
  }, [logger, keyName, rest]);
}
