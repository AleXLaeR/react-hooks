import { useEffect, useRef } from 'react';

export default function useTitle<T extends string>(title: NonNullable<T>, restoreOnUnmount = false) {
  const prevTitleRef = useRef(document.title);

  useEffect(() => {
    if (document.title !== title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    if (restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current;
      };
    }
  }, [restoreOnUnmount]);
}
