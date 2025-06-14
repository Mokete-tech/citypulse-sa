
import { GeminiLiveMessage } from '@/types/geminiLive';

export class GeminiWebSocketManager {
  private ws: WebSocket | null = null;
  private onMessage: (message: GeminiLiveMessage) => void;
  private onConnectionChange: (connected: boolean) => void;
  private onError: (error: string) => void;

  constructor(
    onMessage: (message: GeminiLiveMessage) => void,
    onConnectionChange: (connected: boolean) => void,
    onError: (error: string) => void
  ) {
    this.onMessage = onMessage;
    this.onConnectionChange = onConnectionChange;
    this.onError = onError;
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      if (!projectId) {
        throw new Error('Supabase project ID not configured');
      }
      
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/gemini-live`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.onConnectionChange(true);
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.candidates && data.candidates[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            
            for (const part of parts) {
              if (part.inlineData?.mimeType === 'audio/pcm' && part.inlineData?.data) {
                this.onMessage({ type: 'audio', audio: part.inlineData.data, data });
              } else if (part.text) {
                this.onMessage({ type: 'text', text: part.text, data });
              }
            }
          }
        } catch (error) {
          console.error('Error handling Gemini message:', error);
          this.onError('Error processing message');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError('Connection error');
      };

      this.ws.onclose = () => {
        this.onConnectionChange(false);
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      this.onError('Failed to connect to Gemini Live API');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onConnectionChange(false);
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || false;
  }
}
