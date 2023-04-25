import { useState } from 'react';

const MAX_RGB_VALUE: number = 256;

type UseRandomColorReturnType = [string, () => void];

export default function useRandomColor(): UseRandomColorReturnType {
  const [color, setColor] = useState<string>(() => generateRandomColor());
  const updateColor = () => setColor(generateRandomColor());

  return [color, updateColor];
};

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * MAX_RGB_VALUE);
  const g = Math.floor(Math.random() * MAX_RGB_VALUE);
  const b = Math.floor(Math.random() * MAX_RGB_VALUE);

  return `rgb(${r}, ${g}, ${b})`;
}
