
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <>
      {/* Connection Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isConnected ? (
          <Button 
            onClick={onConnect}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl shadow-md"
          >
            <Zap className="w-5 h-5 mr-2" />
            Connect to Live Chat
          </Button>
        ) : (
          <Button 
            onClick={onDisconnect}
            variant="outline"
            className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 py-3 px-8 rounded-xl"
          >
            <VolumeX className="w-5 h-5 mr-2" />
            Disconnect
          </Button>
        )}
      </div>

      {/* Voice Controls - Only show when connected */}
      {isConnected && (
        <Card className={`border-2 ${darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-purple-50/80 border-purple-200'}`}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-purple-600" />
              Voice Controls
            </h3>
            
            <div className="flex items-center justify-center space-x-6">
              <Button
                onClick={onMicToggle}
                disabled={!isConnected}
                className={`py-4 px-8 rounded-xl font-medium shadow-md ${
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
                    Start Listening
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
              🎤 Click to start talking with PulsePal AI in real-time!
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LiveChatControls;
