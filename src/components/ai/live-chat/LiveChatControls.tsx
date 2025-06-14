
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
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Connect to Live Chat
          </Button>
        ) : (
          <Button 
            onClick={onDisconnect}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <VolumeX className="w-5 h-5 mr-2" />
            Disconnect
          </Button>
        )}
      </div>

      {/* Voice Controls - Only show when connected */}
      {isConnected && (
        <Card className={`border-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'} backdrop-blur-sm`}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-purple-500" />
              Voice Controls
            </h3>
            
            <div className="flex items-center justify-center space-x-6">
              <Button
                onClick={onMicToggle}
                disabled={!isConnected}
                className={`relative py-4 px-8 rounded-xl font-medium transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105'
                } shadow-lg hover:shadow-xl`}
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
                
                {/* Pulsing ring for listening state */}
                {isListening && (
                  <div className="absolute inset-0 rounded-xl border-2 border-white/50 animate-ping"></div>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
              🎤 Click to start talking with PulsePal AI in real-time!
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LiveChatControls;
