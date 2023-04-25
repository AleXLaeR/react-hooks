import { useState, useCallback } from 'react';

type UseRandomNumberReturnType = [number, () => void];

const MAX_NUMBER = Number.MAX_SAFE_INTEGER - 1;

export default function useRandomNumber(max: number = MAX_NUMBER): UseRandomNumberReturnType {
  const [randomNumber, setRandomNumber] = useState(0);

  const getRandomNumber = useCallback(() => {
    const newRandomNumber = Math.floor(Math.random() * (max + 1));
    setRandomNumber(newRandomNumber);
  }, []);

  return [randomNumber, getRandomNumber];
}
