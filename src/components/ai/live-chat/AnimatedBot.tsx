
import { memo } from 'react';

interface AnimatedBotProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const AnimatedBot = memo(({ isListening, isSpeaking }: AnimatedBotProps) => {
  const getEyeState = () => {
    if (isListening) return '👁️'; // Wide eyes when listening
    return '😊'; // Normal happy eyes
  };

  const getMouthAnimation = () => {
    if (isSpeaking) {
      return (
        <div className="text-3xl animate-pulse">
          🗣️
        </div>
      );
    }
    if (isListening) {
      return (
        <div className="text-3xl animate-bounce">
          🎧
        </div>
      );
    }
    return (
      <div className="text-3xl">
        💬
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Bot Face */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg">
        <div className="text-4xl">
          {getEyeState()}
        </div>
      </div>

      {/* Mouth/Action */}
      {getMouthAnimation()}

      {/* Status Text */}
      <div className="text-center">
        <p className="text-xs font-medium">
          {isListening && '👂 Listening...'}
          {isSpeaking && '🗣️ Speaking...'}
          {!isListening && !isSpeaking && '😊 Ready to chat'}
        </p>
      </div>
    </div>
  );
});

AnimatedBot.displayName = 'AnimatedBot';

export default AnimatedBot;
