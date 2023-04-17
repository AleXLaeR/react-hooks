import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type NullableNumber = number | null;

const SECOND_DELAY = 1e3;

export default function useTimer(
  callback: () => void,
  startTime: NullableNumber = null,
): [NullableNumber, Dispatch<SetStateAction<NullableNumber>>, () => void] {
  const [timeLeft, setTimeLeft] = useState<NullableNumber>(startTime);

  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft === 0) {
      setTimeLeft(null);
      if (callback) callback();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev! - 1);
    }, SECOND_DELAY);

    return () => clearInterval(interval);
  }, [timeLeft, callback]);

  function stopTimer() {
    setTimeLeft(null);
  }

  return [timeLeft, setTimeLeft, stopTimer];
}
