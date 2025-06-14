
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface LiveChatMainButtonProps {
  isListening: boolean;
  hasApiKey: boolean;
  onMicToggle: () => void;
}

const LiveChatMainButton = ({ 
  isListening, 
  hasApiKey, 
  onMicToggle 
}: LiveChatMainButtonProps) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Microphone button */}
      <Button
        onClick={onMicToggle}
        disabled={!hasApiKey}
        className={`relative py-6 px-12 rounded-full font-bold text-xl shadow-2xl transition-all duration-300 transform ${
          !hasApiKey
            ? 'bg-gray-400 cursor-not-allowed scale-95'
            : isListening
            ? 'bg-red-600 hover:bg-red-700 text-white scale-110 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-8 h-8 mr-3" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-8 h-8 mr-3" />
            {hasApiKey ? 'Start Talking' : 'API Key Required'}
          </>
        )}
        
        {isListening && (
          <div className="absolute inset-0 border-4 border-red-400/50 rounded-full animate-ping"></div>
        )}
      </Button>

      {/* Instructions */}
      <div className="text-center space-y-2 max-w-md">
        {hasApiKey ? (
          <>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {isListening 
                ? "🎙️ Listening... Speak clearly!" 
                : "Tap the button above to start a voice conversation"
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your conversation will also appear in Regular Chat
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            Please set your Gemini API key above to enable Live Voice Chat
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveChatMainButton;
