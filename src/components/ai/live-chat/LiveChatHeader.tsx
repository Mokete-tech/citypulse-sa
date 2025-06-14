
import { Radio, Sparkles } from 'lucide-react';
import { memo } from 'react';

interface LiveChatHeaderProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const LiveChatHeader = memo(({ isConnected, isListening, isSpeaking }: LiveChatHeaderProps) => {
  return (
    <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/30">
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
        
        {/* Simple status badges */}
        <div className="flex items-center space-x-3">
          {isListening && (
            <div className="flex items-center space-x-2 bg-red-500/40 px-4 py-2 rounded-full border border-red-300/60">
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              <span className="text-sm font-medium">Listening</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center space-x-2 bg-blue-500/40 px-4 py-2 rounded-full border border-blue-300/60">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
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
