
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
        setTimeout(() => setIsBlinking(false), 150);
      }, 2000 + Math.random() * 3000); // Random blinking every 2-5 seconds

      return () => clearInterval(blinkInterval);
    }
  }, [isSpeaking, isListening]);

  // Listening animation - continuous movement
  useEffect(() => {
    if (isListening) {
      const listenInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 800); // Slower, more thoughtful animation

      return () => clearInterval(listenInterval);
    }
  }, [isListening]);

  // Speaking animation - faster mouth movements
  useEffect(() => {
    if (isSpeaking) {
      const speakInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 6);
      }, 250); // Faster talking animation

      return () => clearInterval(speakInterval);
    } else {
      setAnimationPhase(0);
    }
  }, [isSpeaking]);

  const getEmoji = () => {
    // Force blinking state
    if (isBlinking && !isSpeaking && !isListening) {
      return '😴';
    }
    
    if (isSpeaking) {
      // More expressive talking sequence
      const talkingEmojis = ['😮', '🗣️', '😄', '😊', '😯', '🙂'];
      return talkingEmojis[animationPhase];
    }
    
    if (isListening) {
      // More attentive listening sequence
      const listeningEmojis = ['🤔', '👂', '🧐', '😯'];
      return listeningEmojis[animationPhase];
    }
    
    return '😊';
  };

  const getStatusText = () => {
    if (isListening) return '👂 Listening to you...';
    if (isSpeaking) return '🗣️ PulsePal is speaking...';
    if (!hasApiKey) return '🔑 API Key needed to start chatting';
    return '😊 Ready to chat';
  };

  const getAnimationClass = () => {
    const baseClasses = 'transition-all duration-300 ease-out transform select-none';
    
    if (isSpeaking) {
      return `${baseClasses} animate-pulse scale-110 drop-shadow-2xl`;
    }
    
    if (isListening) {
      return `${baseClasses} animate-bounce scale-105 drop-shadow-xl`;
    }
    
    if (isBlinking) {
      return `${baseClasses} scale-95 opacity-70`;
    }
    
    return `${baseClasses} hover:scale-105 drop-shadow-lg`;
  };

  return (
    <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl ${isSpeaking ? 'animate-ping' : 'animate-pulse'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl ${isListening ? 'animate-bounce' : 'animate-pulse'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            🎤 Live Voice Chat
          </h2>
          <p className="text-lg opacity-90">
            Talk naturally with PulsePal AI
          </p>
        </div>

        {/* MASSIVE Animated Emoji */}
        <div className="relative my-8">
          <div className={`text-[240px] leading-none ${getAnimationClass()}`}>
            {getEmoji()}
          </div>
          
          {/* Dynamic glow effects */}
          <div className={`absolute inset-0 rounded-full blur-3xl scale-75 -z-10 transition-all duration-500 ${
            isSpeaking ? 'bg-green-400/40 animate-pulse' :
            isListening ? 'bg-blue-400/40 animate-pulse' :
            'bg-white/20'
          }`}></div>
          
          {/* Animated rings */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 border-4 border-green-400/60 rounded-full scale-125 animate-ping -z-10"></div>
              <div className="absolute inset-0 border-2 border-green-300/40 rounded-full scale-150 animate-pulse -z-10"></div>
            </>
          )}
          
          {isListening && (
            <>
              <div className="absolute inset-0 border-4 border-blue-400/60 rounded-full scale-110 animate-pulse -z-10"></div>
              <div className="absolute inset-0 border-2 border-blue-300/40 rounded-full scale-130 animate-bounce -z-10"></div>
            </>
          )}
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <p className={`text-xl font-medium transition-all duration-300 ${
            isSpeaking ? 'text-green-200 animate-pulse' :
            isListening ? 'text-blue-200 animate-pulse' :
            !hasApiKey ? 'text-yellow-200' :
            'text-white/95'
          }`}>
            {getStatusText()}
          </p>
          
          {/* API Key Status */}
          {!hasApiKey && (
            <div className="flex items-center justify-center space-x-3 bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/30 animate-pulse">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-ping"></span>
              <span className="text-sm font-medium text-yellow-100">
                Set your API Key in Regular Chat first to enable voice chat
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
