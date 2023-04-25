import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

type FocusState = 'focus' | 'blur' | 'none';
type Timeout = ReturnType<typeof setTimeout>;
export default function useFocus<El extends Element>(
  ref: RefObject<El>,
  flickerDelay: number = 100,
): FocusState {
  const [focusState, setFocusState] = useState<FocusState>('none');
  const isFocused = useRef(false);
  const timeoutRef = useRef<Timeout>();

  const onFocus = useCallback(() => setFocusState('focus'), []);
  const onBlur = useCallback(() => setFocusState('blur'), []);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener('mouseover', onFocus);
      node.addEventListener('mouseout', onBlur);

      return () => {
        node.removeEventListener('mouseover', onFocus);
        node.removeEventListener('mouseout', onBlur);
      };
    }
  }, [ref]);

  useEffect(() => {
    if (focusState === 'focus') {
      isFocused.current = true;
    } else {
      timeoutRef.current = setTimeout(() => {
        isFocused.current = false;
      }, flickerDelay);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [focusState]);

  return isFocused.current ? 'focus' : focusState;
};
