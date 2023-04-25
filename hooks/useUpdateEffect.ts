import { DependencyList, EffectCallback, useEffect } from 'react';
import useFirstMount from './useFirstMount';

export default function useUpdateEffect(effect: EffectCallback, deps: DependencyList = []) {
  const isFirstMount = useFirstMount();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
}
