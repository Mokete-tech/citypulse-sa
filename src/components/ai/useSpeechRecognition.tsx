
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current!.continuous = false;
      recognitionRef.current!.interimResults = false;
      recognitionRef.current!.lang = 'en-US';
      return true;
    }
    return false;
  };

  const startListening = (onResult: (transcript: string) => void, onStart: () => void, onEnd: () => void) => {
    if (!initializeRecognition() || !recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    onStart();

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      onEnd();
      
      toast({
        title: "Voice Input Captured",
        description: `"${transcript}"`,
      });
    };

    recognitionRef.current.onerror = () => {
      onEnd();
      toast({
        title: "Recognition Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      onEnd();
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { startListening, stopListening };
};
