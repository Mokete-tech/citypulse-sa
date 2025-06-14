
import { memo } from 'react';

interface AnimatedBotProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const AnimatedBot = memo(({ isConnected, isListening, isSpeaking }: AnimatedBotProps) => {
  const getEyeState = () => {
    if (!isConnected) return '😴'; // Sleeping when disconnected
    if (isListening) return '👀'; // Wide eyes when listening
    return '😊'; // Normal happy eyes
  };

  const getMouthAnimation = () => {
    if (isSpeaking) {
      // Animate mouth when speaking
      return (
        <div className="text-4xl animate-pulse">
          🗣️
        </div>
      );
    }
    if (isListening) {
      return (
        <div className="text-4xl">
          🎧
        </div>
      );
    }
    return (
      <div className="text-4xl">
        💬
      </div>
    );
  };

  const getStatusColor = () => {
    if (!isConnected) return 'bg-gray-400';
    if (isListening) return 'bg-red-500 animate-pulse';
    if (isSpeaking) return 'bg-blue-500 animate-pulse';
    return 'bg-green-500';
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Main Bot Face */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg">
          <div className="text-6xl">
            {getEyeState()}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${getStatusColor()}`}></div>
      </div>

      {/* Mouth/Action Area */}
      <div className="flex flex-col items-center space-y-2">
        {getMouthAnimation()}
        
        {/* Status Text */}
        <div className="text-center">
          <p className="text-sm font-medium">
            {!isConnected && '💤 Sleeping'}
            {isConnected && !isListening && !isSpeaking && '😊 Ready to chat'}
            {isListening && '👂 Listening...'}
            {isSpeaking && '🗣️ Speaking...'}
          </p>
        </div>
      </div>

      {/* Animated Wave Effect */}
      {(isListening || isSpeaking) && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );
});

AnimatedBot.displayName = 'AnimatedBot';

export default AnimatedBot;
