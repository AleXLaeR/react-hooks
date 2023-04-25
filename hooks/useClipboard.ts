import { useCallback, useEffect, useState } from 'react';

type ClipboardData = {
  text?: string;
  image?: Blob;
};
type Copied = boolean;

interface UseClipboardReturnType {
  copy: (data: ClipboardData) => Promise<Copied>;
  isAvailable: boolean;
  isCopied: Copied;
}

export default function useClipboard(copyDelayMs: number = 0): UseClipboardReturnType {
  const [isCopied, setIsCopied] = useState(false);
  const isAvailable = !!navigator.clipboard;

  useEffect(() => {
    if (isCopied && copyDelayMs > 0) {
      const timeout = setTimeout(() => setIsCopied(false), copyDelayMs);
      return () => clearTimeout(timeout);
    }
  }, [isCopied, copyDelayMs]);

  const copy = useCallback(async ({ text, image }: ClipboardData) => {
    try {
      if (!isAvailable) return false;

      if (text) {
        await navigator.clipboard.writeText(text);
      } else if (image) {
        await navigator.clipboard.write([
          new ClipboardItem({ [image.type]: image }),
        ]);
      }

      setIsCopied(true);
      return true;

    } catch (error: any) {
      console.error(error);
      return false;
    }
  }, []);

  return { isCopied, isAvailable, copy };
}
