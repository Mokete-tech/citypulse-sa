
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeminiLiveMessage {
  type: 'audio' | 'text' | 'error' | 'setup';
  data?: any;
  audio?: string;
  text?: string;
  error?: string;
}

export const useGeminiLive = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<GeminiLiveMessage[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({
        sampleRate: 24000,
      });

      // Connect to our Supabase Edge Function
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      if (!projectId) {
        throw new Error('Supabase project ID not configured');
      }
      
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/gemini-live`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        toast({
          title: "Connected to Gemini Live",
          description: "You can now have real-time conversations!",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.candidates && data.candidates[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            
            for (const part of parts) {
              if (part.inlineData?.mimeType === 'audio/pcm' && part.inlineData?.data) {
                // Handle audio response
                await playAudioData(part.inlineData.data);
              } else if (part.text) {
                // Handle text response
                setMessages(prev => [...prev, { type: 'text', text: part.text, data }]);
              }
            }
          }
        } catch (error) {
          console.error('Error handling Gemini message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to Gemini Live",
          variant: "destructive"
        });
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to Gemini Live",
        variant: "destructive"
      });
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  const playAudioData = async (base64Audio: string) => {
    if (!audioContextRef.current) return;

    try {
      setIsSpeaking(true);
      
      // Add to queue for sequential playback
      audioQueueRef.current.push(base64Audio);
      
      if (!isPlayingRef.current) {
        playNextAudio();
      }
    } catch (error) {
      console.error('Error queuing audio:', error);
      setIsSpeaking(false);
    }
  };

  const playNextAudio = async () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    const base64Audio = audioQueueRef.current.shift()!;
    
    try {
      // Decode base64 audio
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio buffer from PCM data
      const audioBuffer = audioContextRef.current.createBuffer(1, bytes.length / 2, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      // Convert bytes to float32 audio samples
      for (let i = 0; i < channelData.length; i++) {
        const sample = (bytes[i * 2] | (bytes[i * 2 + 1] << 8)) / 32768.0;
        channelData[i] = sample;
      }

      // Play the audio
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        playNextAudio();
      };
      
      source.start(0);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      playNextAudio(); // Continue with next audio
    }
  };

  const startListening = useCallback(async () => {
    if (!isConnected || isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          // Convert to base64 and send
          const arrayBuffer = await event.data.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
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

          wsRef.current.send(JSON.stringify(message));
        }
      };

      mediaRecorderRef.current.start(1000); // Send chunks every second
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
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    setIsListening(false);
  }, []);

  const sendText = useCallback((text: string) => {
    if (!isConnected || !wsRef.current) return;

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

    wsRef.current.send(JSON.stringify(message));
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
