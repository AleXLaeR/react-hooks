import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

type WindowScrolls = {
  cursorX: number;
  cursorY: number;
};

function getMousePosition(x: number = 0, y: number = 0): WindowScrolls {
  return { cursorX: x, cursorY: y };
}

export default function useCursorPosition(debounceInterval: number = 100): WindowScrolls {
  const [mousePos, setMousePos] = useState(getMousePosition());
  const debouncedMousePos = useDebounce(mousePos, debounceInterval);

  const handleResize = useCallback(({ clientX, clientY }: MouseEvent) => {
     return setMousePos(getMousePosition(clientX, clientY));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleResize);
    return () => window.removeEventListener('mousemove', handleResize);
  }, [handleResize]);

  return debouncedMousePos;
}
