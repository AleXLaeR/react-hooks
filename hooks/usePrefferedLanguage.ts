import { useCallback, useEffect, useState } from 'react';

type Language = string;
type UsePreferredLanguageReturnType = [Language, (newLanguage: Language) => void];

function getLanguage(): Language {
  return (window.navigator?.language || window.navigator?.languages[0]) ?? 'en-US';
}

export default function usePreferredLanguage(): UsePreferredLanguageReturnType {
  const [language, setLanguage] = useState<Language>(() => getLanguage());

  const handleLanguageChange = useCallback(() => setLanguage(getLanguage()), []);

  useEffect(() => {
    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [handleLanguageChange]);

  return [language, setLanguage];
}