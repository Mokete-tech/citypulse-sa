
import { memo, useState, useEffect } from 'react';

interface LiveChatHeaderProps {
  isListening: boolean;
  isSpeaking: boolean;
  hasApiKey: boolean;
}

const LiveChatHeader = memo(({ isListening, isSpeaking, hasApiKey }: LiveChatHeaderProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking animation when idle
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }, 2000 + Math.random() * 2000);

      return () => clearInterval(blinkInterval);
    } else {
      setIsBlinking(false);
    }
  }, [isSpeaking, isListening]);

  // Listening animation - head tilting and thoughtful expressions
  useEffect(() => {
    if (isListening) {
      const listenInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 600);

      return () => clearInterval(listenInterval);
    }
  }, [isListening]);

  // Speaking animation - mouth movements and expressions
  useEffect(() => {
    if (isSpeaking) {
      const speakInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 6);
      }, 300);

      return () => clearInterval(speakInterval);
    } else {
      setAnimationPhase(0);
    }
  }, [isSpeaking]);

  const getEmoji = () => {
    if (isBlinking) {
      return '😴';
    }
    
    if (isSpeaking) {
      // Animated talking sequence
      const talkingEmojis = ['😮', '😯', '🗣️', '😊', '😄', '🙂'];
      return talkingEmojis[animationPhase];
    }
    
    if (isListening) {
      // Animated listening sequence - more expressive
      const listeningEmojis = ['🤔', '👂', '🧐', '😯'];
      return listeningEmojis[animationPhase];
    }
    
    return '😊';
  };

  const getStatusText = () => {
    if (isListening) return '👂 Listening to you...';
    if (isSpeaking) return '🗣️ PulsePal is speaking...';
    return '😊 Ready to chat';
  };

  const getAnimationClass = () => {
    const baseClasses = 'transition-all duration-300 ease-out transform';
    
    if (isSpeaking) {
      return `${baseClasses} animate-pulse scale-110 drop-shadow-2xl hover:scale-115`;
    }
    
    if (isListening) {
      return `${baseClasses} animate-bounce scale-105 drop-shadow-xl`;
    }
    
    if (isBlinking) {
      return `${baseClasses} scale-95 opacity-80`;
    }
    
    return `${baseClasses} hover:scale-110 drop-shadow-md hover:drop-shadow-xl`;
  };

  const getContainerClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (isListening) return 'animate-pulse';
    return '';
  };

  return (
    <div className="relative p-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white min-h-[400px] flex items-center justify-center">
      <div className={`flex flex-col items-center space-y-8 text-center ${getContainerClass()}`}>
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
          <div className={`text-[200px] leading-none select-none ${getAnimationClass()}`}>
            {getEmoji()}
          </div>
          
          {/* Dynamic glow effect */}
          <div className={`absolute inset-0 rounded-full blur-3xl scale-75 -z-10 transition-all duration-500 ${
            isSpeaking ? 'bg-green-400/30 animate-pulse' :
            isListening ? 'bg-blue-400/30 animate-pulse' :
            'bg-white/10 opacity-50'
          }`}></div>
          
          {/* Extra animated ring for speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 border-4 border-green-400/50 rounded-full scale-125 animate-ping -z-10"></div>
          )}
          
          {/* Extra animated ring for listening */}
          {isListening && (
            <div className="absolute inset-0 border-4 border-blue-400/50 rounded-full scale-110 animate-pulse -z-10"></div>
          )}
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
