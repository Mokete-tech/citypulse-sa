
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeminiLiveMessage, GeminiLiveHookReturn } from '@/types/geminiLive';
import { AudioQueue, createMediaRecorder, encodeAudioData } from '@/utils/audioUtils';
import { GeminiWebSocketManager } from '@/utils/geminiWebSocket';

export const useGeminiLive = (): GeminiLiveHookReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<GeminiLiveMessage[]>([]);
  
  const wsManagerRef = useRef<GeminiWebSocketManager | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  
  const { toast } = useToast();

  const handleMessage = useCallback((message: GeminiLiveMessage) => {
    if (message.type === 'audio' && message.audio) {
      audioQueueRef.current?.addToQueue(message.audio);
    } else {
      setMessages(prev => [...prev, message]);
    }
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setIsListening(false);
      setIsSpeaking(false);
    }
    
    if (connected) {
      toast({
        title: "Connected to Gemini Live",
        description: "You can now have real-time conversations!",
      });
    }
  }, [toast]);

  const handleError = useCallback((error: string) => {
    toast({
      title: "Connection Error",
      description: error,
      variant: "destructive"
    });
  }, [toast]);

  const connect = useCallback(async () => {
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({
        sampleRate: 24000,
      });

      // Initialize audio queue
      audioQueueRef.current = new AudioQueue(
        audioContextRef.current,
        setIsSpeaking
      );

      // Initialize WebSocket manager
      wsManagerRef.current = new GeminiWebSocketManager(
        handleMessage,
        handleConnectionChange,
        handleError
      );

      await wsManagerRef.current.connect();

    } catch (error) {
      console.error('Failed to connect:', error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to Gemini Live",
        variant: "destructive"
      });
    }
  }, [handleMessage, handleConnectionChange, handleError, toast]);

  const disconnect = useCallback(() => {
    wsManagerRef.current?.disconnect();
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    audioQueueRef.current?.clear();
    audioQueueRef.current = null;
    
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(async () => {
    if (!isConnected || isListening || !wsManagerRef.current) return;

    try {
      const { mediaRecorder, stream } = await createMediaRecorder(async (data) => {
        if (wsManagerRef.current?.isConnected()) {
          const base64 = await encodeAudioData(data);
          
          const message = {
            clientContent: {
              turns: [{
                parts: [{
                  inlineData: {
                    mimeType: 'audio/webm;codecs=opus',
                    data: base64
                  }
                }]
              }],
              turnComplete: true
            }
          };

          wsManagerRef.current.send(message);
        }
      });

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      
      mediaRecorder.start(1000); // Send chunks every second
      setIsListening(true);

      toast({
        title: "Listening...",
        description: "Speak now and Gemini will respond in real-time!",
      });

    } catch (error) {
      console.error('Error starting audio capture:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  }, [isConnected, isListening, toast]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsListening(false);
  }, []);

  const sendText = useCallback((text: string) => {
    if (!isConnected || !wsManagerRef.current) return;

    const message = {
      clientContent: {
        turns: [{
          parts: [{
            text: text
          }]
        }],
        turnComplete: true
      }
    };

    wsManagerRef.current.send(message);
    setMessages(prev => [...prev, { type: 'text', text, data: message }]);
  }, [isConnected]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
  };
};
