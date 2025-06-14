
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface LiveChatControlsProps {
  isListening: boolean;
  onMicToggle: () => void;
  hasApiKey: boolean;
}

const LiveChatControls = ({ 
  isListening, 
  onMicToggle,
  hasApiKey
}: LiveChatControlsProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onMicToggle}
        disabled={!hasApiKey}
        className={`py-4 px-8 rounded-2xl font-medium shadow-lg text-lg ${
          !hasApiKey
            ? 'bg-gray-400 cursor-not-allowed'
            : isListening
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-6 h-6 mr-2" />
            {hasApiKey ? 'Start Talking' : 'API Key Required'}
          </>
        )}
      </Button>
    </div>
  );
};

export default LiveChatControls;
