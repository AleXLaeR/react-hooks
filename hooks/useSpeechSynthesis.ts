import { useEffect, useState, useMemo } from 'react';

type VoiceConfig = {
  language: string;
  voiceURI: string;
};

type UseSpeechSynthesisActions = {
  speak: (text: string) => void;
  cancel: () => void;
};

type UseSpeechSynthesisReturnType = [
  isSpeaking: boolean,
  actions: UseSpeechSynthesisActions,
];

export default function useSpeechSynthesis({
  language,
  voiceURI,
}: VoiceConfig): UseSpeechSynthesisReturnType {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => setVoices(speechSynthesis.getVoices());
    loadVoices();

    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const memoizedVoices = useMemo(() => voices, [voices]);

  const actions: UseSpeechSynthesisActions = useMemo(
    () => ({
      speak: (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = memoizedVoices.find(
          ({ lang, voiceURI: vUri }) => lang === language && vUri === voiceURI
        );

        if (voice) {
          utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      },
      cancel: () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      },
    }),
    [language, voiceURI],
  );

  return [isSpeaking, actions];
}
