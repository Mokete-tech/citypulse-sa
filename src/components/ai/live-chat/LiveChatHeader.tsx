
import { memo, useState, useEffect } from 'react';

interface LiveChatHeaderProps {
  isListening: boolean;
  isSpeaking: boolean;
  hasApiKey: boolean;
}

const LiveChatHeader = memo(({ isListening, isSpeaking, hasApiKey }: LiveChatHeaderProps) => {
  const [eyeState, setEyeState] = useState('open');
  const [mouthState, setMouthState] = useState('smile');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Realistic blinking animation when idle
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      const blinkInterval = setInterval(() => {
        setEyeState('blink');
        setTimeout(() => setEyeState('open'), 150);
      }, 2000 + Math.random() * 3000); // Natural blink timing

      return () => clearInterval(blinkInterval);
    }
  }, [isSpeaking, isListening]);

  // Listening animation - thoughtful expressions
  useEffect(() => {
    if (isListening) {
      setEyeState('focused');
      setMouthState('neutral');
      
      const listenInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 3);
      }, 800);

      return () => clearInterval(listenInterval);
    }
  }, [isListening]);

  // Speaking animation - realistic mouth movements
  useEffect(() => {
    if (isSpeaking) {
      setEyeState('engaged');
      
      const speakInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 200);

      return () => clearInterval(speakInterval);
    } else {
      setAnimationPhase(0);
      if (!isListening) {
        setEyeState('open');
        setMouthState('smile');
      }
    }
  }, [isSpeaking, isListening]);

  const getEyes = () => {
    if (eyeState === 'blink') return '😌';
    if (eyeState === 'focused' && isListening) {
      return animationPhase === 1 ? '🤔' : '😯';
    }
    if (eyeState === 'engaged') return '😊';
    return '😊';
  };

  const getMouth = () => {
    if (isSpeaking) {
      const speakingMouths = ['😮', '😯', '🙂', '😊'];
      return speakingMouths[animationPhase];
    }
    if (isListening) {
      return animationPhase === 2 ? '🤔' : '😯';
    }
    return '😊';
  };

  const getFinalEmoji = () => {
    if (isSpeaking) {
      const talkingEmojis = ['😮', '😯', '🙂', '😊'];
      return talkingEmojis[animationPhase];
    }
    
    if (isListening) {
      const listeningEmojis = ['🤔', '😯', '🧐'];
      return listeningEmojis[animationPhase];
    }
    
    if (eyeState === 'blink') {
      return '😌';
    }
    
    return '😊';
  };

  const getStatusText = () => {
    if (isListening) return '👂 Listening to you...';
    if (isSpeaking) return '🗣️ PulsePal is speaking...';
    return '😊 Ready to chat';
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse scale-105';
    if (isListening) return 'animate-bounce';
    return 'hover:scale-105 transition-transform duration-300';
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

        {/* Sophisticated Animated Emoji */}
        <div className={`text-9xl transition-all duration-200 ease-in-out ${getAnimationClass()}`}>
          {getFinalEmoji()}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-white/90">
            {getStatusText()}
          </p>
        </div>

        {/* API Key Status */}
        {!hasApiKey && (
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
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
