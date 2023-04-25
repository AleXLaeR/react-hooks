import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type NullableNumber = number | null;
type Interval = ReturnType<typeof setInterval>;

type UseTimerReturnType = [NullableNumber, Dispatch<SetStateAction<NullableNumber>>, () => void];

const SECOND_DELAY = 1e3;

export default function useTimer(
  callback: () => void,
  startTime: NullableNumber = null,
): UseTimerReturnType {
  const [timeLeft, setTimeLeft] = useState<NullableNumber>(startTime);
  const intervalRef = useRef<Interval>();

  useEffect(() => {
    if (!timeLeft) return;

    if (timeLeft === 0) {
      setTimeLeft(null);
      if (callback) callback();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev! - 1);
    }, SECOND_DELAY);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, callback]);

  const stopTimer = () => setTimeLeft(null);

  return [timeLeft, setTimeLeft, stopTimer];
}
