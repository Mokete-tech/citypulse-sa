
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
      // Use the current domain to construct the WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      
      // For Lovable projects, the edge function URL pattern
      let wsUrl: string;
      if (host.includes('lovableproject.com')) {
        // Extract project ID from the current URL
        const projectId = host.split('.')[0];
        wsUrl = `wss://${projectId}.lovableproject.com/functions/v1/gemini-live`;
      } else {
        // Fallback for other environments
        wsUrl = `${protocol}//${host}/functions/v1/gemini-live`;
      }
      
      console.log('Connecting to WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.onConnectionChange(true);
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
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
        this.onError('Connection error - please check if the Gemini API key is configured');
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
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
      console.log('Sending message to WebSocket:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not ready, state:', this.ws?.readyState);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || false;
  }
}
