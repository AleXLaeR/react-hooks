
interface UseSSRReturnType {
  isClient: boolean;
  isServer: boolean;
}

export default function useSSR(): UseSSRReturnType {
  const isDOM = Boolean(typeof window !== 'undefined' && window.document?.documentElement);

  return {
    isClient: isDOM,
    isServer: !isDOM,
  };
}