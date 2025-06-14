
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface LiveChatControlsProps {
  isListening: boolean;
  onMicToggle: () => void;
}

const LiveChatControls = ({ 
  isListening, 
  onMicToggle 
}: LiveChatControlsProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onMicToggle}
        className={`py-4 px-8 rounded-2xl font-medium shadow-lg text-lg ${
          isListening
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
            Start Talking
          </>
        )}
      </Button>
    </div>
  );
};

export default LiveChatControls;
