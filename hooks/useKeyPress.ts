import { useState, useEffect, useCallback } from 'react';

export default function useKeyPress(
  targetKeys: string | string[],
  onKeyPress?: () => void,
  target: EventTarget | null = window,
): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const includesKey = (key: string): boolean => {
    return Array.isArray(targetKeys) ? targetKeys.includes(key) : targetKeys === key;
  }

  const downHandler = useCallback(
    ({ key }: KeyboardEvent) => {
      if (includesKey(key)) {
        setKeyPressed(true);
        if (onKeyPress) onKeyPress();
      }
    },
    [onKeyPress, targetKeys],
  );

  const upHandler = useCallback(
    ({ key }: KeyboardEvent) => {
      if (includesKey(key)) {
        setKeyPressed(false);
      }
    },
    [targetKeys],
  );

  useEffect(() => {
    target.addEventListener('keydown', downHandler);
    target.addEventListener('keyup', upHandler);

    return () => {
      target.removeEventListener('keydown', downHandler);
      target.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler, target]);

  return keyPressed;
}
