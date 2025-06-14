
import { Button } from '@/components/ui/button';
import { Zap, VolumeX, Mic, MicOff } from 'lucide-react';

interface LiveChatControlsProps {
  isConnected: boolean;
  isListening: boolean;
  darkMode: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onMicToggle: () => void;
}

const LiveChatControls = ({ 
  isConnected, 
  isListening, 
  darkMode, 
  onConnect, 
  onDisconnect, 
  onMicToggle 
}: LiveChatControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Connection Controls */}
      <div className="flex items-center justify-center">
        {!isConnected ? (
          <Button 
            onClick={onConnect}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-2xl shadow-lg text-lg"
          >
            <Zap className="w-6 h-6 mr-2" />
            Connect & Chat
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onDisconnect}
              variant="outline"
              className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 py-3 px-6 rounded-2xl"
            >
              <VolumeX className="w-5 h-5 mr-2" />
              Disconnect
            </Button>
            
            <Button
              onClick={onMicToggle}
              disabled={!isConnected}
              className={`py-4 px-8 rounded-2xl font-medium shadow-lg text-lg ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 mr-2" />
                  Talk
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isConnected && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🎤 Tap "Talk" and speak naturally with PulsePal!
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveChatControls;
