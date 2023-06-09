import { useLayoutEffect } from 'react';

export default function useLockBodyScroll() {
  useLayoutEffect(() => {
    const initialOverflow = getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = initialOverflow;
    };
  }, []);
}
