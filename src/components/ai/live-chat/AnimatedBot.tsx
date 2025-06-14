
import { memo } from 'react';

interface AnimatedBotProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const AnimatedBot = memo(({ isListening, isSpeaking }: AnimatedBotProps) => {
  const getMainEmoji = () => {
    if (isSpeaking) return '🗣️';
    if (isListening) return '👂';
    return '🤖';
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (isListening) return 'animate-bounce';
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Large Animated Bot */}
      <div className={`text-8xl transition-all duration-300 ${getAnimationClass()}`}>
        {getMainEmoji()}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-sm font-medium text-white/90">
          {isListening && '👂 Listening to you...'}
          {isSpeaking && '🗣️ PulsePal is speaking...'}
          {!isListening && !isSpeaking && '🤖 Ready to chat'}
        </p>
      </div>
    </div>
  );
});

AnimatedBot.displayName = 'AnimatedBot';

export default AnimatedBot;
