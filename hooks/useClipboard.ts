import { useCallback, useEffect, useState } from 'react';

type ClipboardData = {
  text?: string;
  image?: Blob;
};

type Copied = boolean;
type UseClipBoardReturnType = {
  copy: (data: ClipboardData) => Promise<Copied>;
  isCopied: Copied;
};

export default function useClipboard(delayMs: number = 1e3): UseClipBoardReturnType {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), delayMs);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const copy = useCallback(async ({ text, image }: ClipboardData) => {
    try {
      if (navigator.clipboard) {
        if (text) {
          await navigator.clipboard.writeText(text);
        } else if (image) {
          await navigator.clipboard.write([
            new ClipboardItem({ [image.type]: image }),
          ]);
        }
        setIsCopied(true);
        return true;
      }
      alert('Clipboard API not available');
    } catch (error: any) {
      console.error(error);
    }

    return false;
  }, []);

  return { copy, isCopied };
};
