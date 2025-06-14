
import { Radio, Sparkles, Waves, Volume2 } from 'lucide-react';
import { memo } from 'react';

interface LiveChatHeaderProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const LiveChatHeader = memo(({ isConnected, isListening, isSpeaking }: LiveChatHeaderProps) => {
  return (
    <div className={`relative p-6 ${
      isConnected 
        ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' 
        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
    } text-white`}>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected ? 'bg-white/20' : 'bg-white/10'
            } backdrop-blur-sm border-2 border-white/30`}>
              <Radio className="w-6 h-6" />
            </div>
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              🎤 Live Chat with PulsePal
              <Sparkles className="w-5 h-5 ml-2" />
            </h2>
            <p className="text-sm opacity-90 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : 'bg-gray-400'
              }`}></span>
              {isConnected 
                ? 'Connected • Real-time voice chat active'
                : 'Disconnected • Click connect to start'
              }
            </p>
          </div>
        </div>
        
        {/* Static status indicators without animations */}
        <div className="flex items-center space-x-3">
          {isListening && (
            <div className="flex items-center space-x-2 bg-red-500/30 px-4 py-2 rounded-full border border-red-300/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">Listening</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center space-x-2 bg-blue-500/30 px-4 py-2 rounded-full border border-blue-300/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">Speaking</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
