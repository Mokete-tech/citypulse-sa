
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  const initializeSpeech = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      return true;
    }
    return false;
  };

  const speakMessage = (text: string, volume: number = 0.7) => {
    if (!initializeSpeech() || !synthRef.current) {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text.",
        variant: "destructive"
      });
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return { speakMessage, stopSpeaking, isSpeaking };
};
