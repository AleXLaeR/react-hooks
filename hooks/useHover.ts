import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

type HoverState = 'hover' | 'blur' | 'none';
type Timeout = ReturnType<typeof setTimeout>;

export default function useHover<El extends Element>(
  ref: RefObject<El>,
  flickerDelay = 100,
): HoverState {
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const isHovering = useRef(false);
  const timeout = useRef<Timeout>();

  const onMouseOver = useCallback(() => setHoverState('hover'), []);
  const onMouseOut = useCallback(() => setHoverState('blur'), []);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener('mouseover', onMouseOver);
      node.addEventListener('mouseout', onMouseOut);

      return () => {
        node.removeEventListener('mouseover', onMouseOver);
        node.removeEventListener('mouseout', onMouseOut);
      };
    }
  }, [ref]);

  useEffect(() => {
    if (hoverState === 'hover') {
      isHovering.current = true;
    } else {
      timeout.current = setTimeout(() => {
        isHovering.current = false;
      }, flickerDelay);

      return () => clearTimeout(timeout.current);
    }
  }, [hoverState]);

  return isHovering.current ? 'hover' : hoverState;
};
