import { useEffect, useState } from 'react';
import useDebounce from '../useDebounce';

type WindowScrolls = {
  cursorX: number;
  cursorY: number;
};

function getMousePosition(x: number = 0, y: number = 0): WindowScrolls {
  return { cursorX: x, cursorY: y };
}

export default function useCursorPosition(debounceInterval?: number) {
  const [mousePos, setMousePos] = useState(getMousePosition());
  const debouncedMousePos = useDebounce(mousePos, debounceInterval);

  useEffect(() => {
    function handleResize({ clientX, clientY }: MouseEvent) {
      setMousePos(getMousePosition(clientX, clientY));
    }

    window.addEventListener('mousemove', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleResize);
    };
  }, []);

  return debouncedMousePos;
}
