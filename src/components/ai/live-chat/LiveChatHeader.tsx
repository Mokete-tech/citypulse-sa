
import { Radio, Sparkles, Waves, Volume2 } from 'lucide-react';
import { useMemo, memo } from 'react';

interface LiveChatHeaderProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const LiveChatHeader = memo(({ isConnected, isListening, isSpeaking }: LiveChatHeaderProps) => {
  // Memoize all computed values
  const backgroundGradient = useMemo(() => 
    isConnected 
      ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' 
      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500',
    [isConnected]
  );

  const statusText = useMemo(() => 
    isConnected 
      ? 'Connected • Real-time voice chat active'
      : 'Disconnected • Click connect to start',
    [isConnected]
  );

  const iconClasses = useMemo(() => 
    `w-12 h-12 rounded-full flex items-center justify-center ${
      isConnected ? 'bg-white/20' : 'bg-white/10'
    } backdrop-blur-sm border-2 border-white/30`,
    [isConnected]
  );

  const statusDotClasses = useMemo(() => 
    `w-2 h-2 rounded-full mr-2 ${
      isConnected ? 'bg-green-400' : 'bg-gray-400'
    }`,
    [isConnected]
  );

  return (
    <div className={`relative p-6 ${backgroundGradient} text-white overflow-hidden`}>
      {/* Simplified static background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={iconClasses}>
              <Radio className="w-6 h-6" />
            </div>
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              🎤 Live Chat with PulsePal
              <Sparkles className="w-5 h-5 ml-2" />
            </h2>
            <p className="text-sm opacity-90 flex items-center">
              <span className={statusDotClasses}></span>
              {statusText}
            </p>
          </div>
        </div>
        
        {/* Status indicators - only animate when necessary */}
        <div className="flex items-center space-x-3">
          {isListening && (
            <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-300">
              <Waves className="w-4 h-4" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-300">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">Speaking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
