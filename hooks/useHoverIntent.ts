import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import useCursorPosition from './useCursorPosition';

type Timeout = ReturnType<typeof setTimeout>;

interface HoverIntentOptions {
  sensitivity?: number;
  timeout?: number;
}

export default function useHoverIntent<El extends Element>(
  elRef: RefObject<El>,
  { sensitivity = 5, timeout = 100 }: HoverIntentOptions,
) {
  const [isHovering, setIsHovering] = useState(false);
  const [isIntent, setIsIntent] = useState(false);

  const timeoutRef = useRef<Timeout>();
  const { cursorX, cursorY } = useCursorPosition();

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    timeoutRef.current = setTimeout(() => setIsIntent(true), timeout);
  }, [timeout]);

  const handleMouseMove = useCallback(
    ({ pageX, pageY }: MouseEvent) => {
      const deltaX = pageX - cursorX;
      const deltaY = pageY - cursorY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > sensitivity) {
        setIsIntent(false);
        clearTimeout(timeoutRef.current);
      }
    },
    [sensitivity, cursorX, cursorY],
  ) as EventListenerOrEventListenerObject;

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsIntent(false);

    clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const element = elRef.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutRef.current);
    };
  }, [elRef, handleMouseEnter, handleMouseMove, handleMouseLeave]);

  return [isHovering, isIntent];
}
