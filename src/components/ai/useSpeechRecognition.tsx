
import { useRef } from 'react';
import { toast } from 'sonner';

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor: typeof SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      toast.error("Speech Recognition Not Available", {
        description: "Your browser doesn't support speech recognition.",
      });
      return;
    }

    onStart();

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      onEnd();
      
      toast.info("Voice Input Captured", {
        description: `"${transcript}"`,
      });
    };

    recognitionRef.current.onerror = () => {
      onEnd();
      toast.error("Recognition Error", {
        description: "Failed to recognize speech. Please try again.",
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
