
import { memo, useState, useEffect } from 'react';

interface AnimatedBotProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const AnimatedBot = memo(({ isListening, isSpeaking }: AnimatedBotProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkingFrame, setTalkingFrame] = useState(0);

  // Blinking animation
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

      return () => clearInterval(blinkInterval);
    }
  }, [isSpeaking, isListening]);

  // Talking animation frames
  useEffect(() => {
    if (isSpeaking) {
      const talkInterval = setInterval(() => {
        setTalkingFrame(prev => (prev + 1) % 3);
      }, 300);

      return () => clearInterval(talkInterval);
    } else {
      setTalkingFrame(0);
    }
  }, [isSpeaking]);

  const getBotFace = () => {
    if (isSpeaking) {
      // Different talking expressions
      const talkingFaces = ['🗣️', '😮', '🤖'];
      return talkingFaces[talkingFrame];
    }
    
    if (isListening) {
      return '🤔'; // Thinking/listening face
    }
    
    if (isBlinking) {
      return '😌'; // Blinking/peaceful face
    }
    
    return '🤖'; // Default friendly bot face
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (isListening) return 'animate-bounce';
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Large Animated Bot Face */}
      <div className={`text-9xl transition-all duration-300 ${getAnimationClass()}`}>
        {getBotFace()}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-white/90">
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
