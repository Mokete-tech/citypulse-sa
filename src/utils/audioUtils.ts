
export class AudioQueue {
  private queue: string[] = [];
  private isPlaying = false;
  private audioContext: AudioContext | null;
  private onSpeakingChange: (isSpeaking: boolean) => void;

  constructor(audioContext: AudioContext | null, onSpeakingChange: (isSpeaking: boolean) => void) {
    this.audioContext = audioContext;
    this.onSpeakingChange = onSpeakingChange;
  }

  async addToQueue(base64Audio: string) {
    this.queue.push(base64Audio);
    
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  private async playNext() {
    if (!this.audioContext || this.queue.length === 0) {
      this.isPlaying = false;
      this.onSpeakingChange(false);
      return;
    }

    this.isPlaying = true;
    this.onSpeakingChange(true);
    
    const base64Audio = this.queue.shift()!;
    
    try {
      // Decode base64 audio
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio buffer from PCM data
      const audioBuffer = this.audioContext.createBuffer(1, bytes.length / 2, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      // Convert bytes to float32 audio samples
      for (let i = 0; i < channelData.length; i++) {
        const sample = (bytes[i * 2] | (bytes[i * 2 + 1] << 8)) / 32768.0;
        channelData[i] = sample;
      }

      // Play the audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        this.playNext();
      };
      
      source.start(0);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext(); // Continue with next audio
    }
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
    this.onSpeakingChange(false);
  }
}

export const createMediaRecorder = async (onDataAvailable: (data: Blob) => void) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    }
  });

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      onDataAvailable(event.data);
    }
  };

  return { mediaRecorder, stream };
};

export const encodeAudioData = async (data: Blob): Promise<string> => {
  const arrayBuffer = await data.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};
