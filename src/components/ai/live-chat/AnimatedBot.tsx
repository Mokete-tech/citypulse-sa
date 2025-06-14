
import { memo, useState, useEffect } from 'react';

interface AnimatedBotProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const AnimatedBot = memo(({ isListening, isSpeaking }: AnimatedBotProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [lipMovement, setLipMovement] = useState(0);

  // Blinking animation
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 2000 + Math.random() * 3000); // Random blink every 2-5 seconds

      return () => clearInterval(blinkInterval);
    }
  }, [isSpeaking, isListening]);

  // Lip movement when speaking
  useEffect(() => {
    if (isSpeaking) {
      const lipInterval = setInterval(() => {
        setLipMovement(prev => (prev + 1) % 3);
      }, 200);

      return () => clearInterval(lipInterval);
    } else {
      setLipMovement(0);
    }
  }, [isSpeaking]);

  const getEyes = () => {
    if (isListening) return '👀'; // Wide alert eyes when listening
    if (isBlinking) return '😌'; // Closed eyes when blinking  
    return '👁️👁️'; // Normal open eyes
  };

  const getMouth = () => {
    if (isSpeaking) {
      // Animated mouth movements when talking
      const mouths = ['😮', '🗣️', '😯'];
      return mouths[lipMovement];
    }
    if (isListening) return '🤔'; // Thinking expression when listening
    return '😊'; // Happy mouth when idle
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (isListening) return 'animate-bounce';
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Complete Bot Face - Much Larger */}
      <div className={`text-9xl transition-all duration-300 ${getAnimationClass()}`}>
        <div className="flex flex-col items-center space-y-2">
          {/* Eyes */}
          <div className="text-7xl">{getEyes()}</div>
          {/* Mouth */}
          <div className="text-5xl -mt-4">{getMouth()}</div>
        </div>
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
