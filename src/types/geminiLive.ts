
export interface GeminiLiveMessage {
  type: 'audio' | 'text' | 'error' | 'setup';
  data?: any;
  audio?: string;
  text?: string;
  error?: string;
}

export interface GeminiLiveHookReturn {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  messages: GeminiLiveMessage[];
  connect: () => Promise<void>;
  disconnect: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  sendText: (text: string) => void;
}
