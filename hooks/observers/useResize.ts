import { RefObject, useEffect, useRef, useState } from 'react';

export interface ContentRect {
  width: number;
  height: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
}

export default function useResize<El extends Element>(ref: RefObject<El>): ContentRect {
  const animFrameId = useRef(0);
  const [measurements, setMeasurements] = useState<ContentRect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        cancelAnimationFrame(animFrameId.current);

        animFrameId.current = requestAnimationFrame(() => {
          if (ref.current) {
            setMeasurements(entry.contentRect);
          }
        });
      }
    })

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return measurements;
}
