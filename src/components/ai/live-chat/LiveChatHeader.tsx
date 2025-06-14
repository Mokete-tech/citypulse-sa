
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
    if (isSpeaking) return 'animate-pulse scale-110 drop-shadow-lg';
    if (isListening) return 'animate-bounce scale-105';
    return 'hover:scale-110 transition-all duration-300 drop-shadow-md';
  };

  return (
    <div className="relative p-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">
            🎤 Voice Chat
          </h2>
          <p className="text-lg opacity-90">
            Talk naturally with PulsePal AI
          </p>
        </div>

        {/* HUGE Animated Emoji - This is the main focus */}
        <div className="relative">
          <div className={`text-[200px] leading-none transition-all duration-300 ease-out ${getAnimationClass()}`}>
            {getFinalEmoji()}
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-75 -z-10 opacity-50"></div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <p className="text-xl font-medium text-white/95">
            {getStatusText()}
          </p>
          
          {/* API Key Status */}
          {!hasApiKey && (
            <div className="flex items-center justify-center space-x-3 bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/30">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-sm font-medium text-yellow-100">
                Need API Key - Set it in Regular Chat first
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
