
import { memo, useState, useEffect } from 'react';

interface LiveChatHeaderProps {
  isListening: boolean;
  isSpeaking: boolean;
  hasApiKey: boolean;
}

const LiveChatHeader = memo(({ isListening, isSpeaking, hasApiKey }: LiveChatHeaderProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkingFrame, setTalkingFrame] = useState(0);

  // Blinking animation when idle
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
      }, 400);

      return () => clearInterval(talkInterval);
    } else {
      setTalkingFrame(0);
    }
  }, [isSpeaking]);

  const getBotEmoji = () => {
    if (isSpeaking) {
      // Talking animation with different mouth positions
      const talkingEmojis = ['😮', '😯', '🙂'];
      return talkingEmojis[talkingFrame];
    }
    
    if (isListening) {
      return '🤔'; // Thinking while listening
    }
    
    if (isBlinking) {
      return '😌'; // Blinking/peaceful
    }
    
    return '😊'; // Default happy face
  };

  const getStatusText = () => {
    if (isListening) return '👂 Listening to you...';
    if (isSpeaking) return '🗣️ PulsePal is speaking...';
    return '😊 Ready to chat';
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (isListening) return 'animate-bounce';
    return '';
  };

  return (
    <div className="relative p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            🎤 Voice Chat
          </h2>
          <p className="text-sm opacity-90">
            Talk naturally with PulsePal AI
          </p>
        </div>

        {/* Animated Bot Emoji */}
        <div className={`text-9xl transition-all duration-300 ${getAnimationClass()}`}>
          {getBotEmoji()}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-white/90">
            {getStatusText()}
          </p>
        </div>

        {/* Simple Status - only show if no API key */}
        {!hasApiKey && (
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-sm font-medium">
              Need API Key - Set it in Regular Chat first
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
