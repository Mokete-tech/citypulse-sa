
import { useState, useCallback, memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = memo(({ darkMode }: LiveChatInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  
  const { apiKey, sendMessage } = useAI();
  const { toast } = useToast();

  // Natural blinking animation when idle
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 2000 + Math.random() * 3000);

      return () => clearInterval(blinkInterval);
    }
  }, [isSpeaking, isListening]);

  // Listening animation - continuous movement
  useEffect(() => {
    if (isListening) {
      const listenInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 800);

      return () => clearInterval(listenInterval);
    }
  }, [isListening]);

  // Speaking animation - faster mouth movements
  useEffect(() => {
    if (isSpeaking) {
      const speakInterval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 6);
      }, 250);

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
    if (!apiKey?.trim()) return '🔑 API Key needed to start chatting';
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

  const handleMicToggle = useCallback(async () => {
    if (!apiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in Regular Chat mode first to use voice chat",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // Stop listening
      setIsListening(false);
      console.log('Stopped listening');
      
      // Simulate processing and then speaking
      setTimeout(() => {
        setIsSpeaking(true);
        console.log('AI is now speaking');
        
        // Send a message to demonstrate the connection
        sendMessage("Hello! I heard you speaking in voice chat. This is a demo response from PulsePal AI.");
        
        // Stop speaking after 4 seconds
        setTimeout(() => {
          setIsSpeaking(false);
          console.log('AI finished speaking');
          
          toast({
            title: "Voice interaction complete",
            description: "Check Regular Chat to see the full conversation!",
          });
        }, 4000);
      }, 1000);
      
    } else {
      // Start listening
      setIsListening(true);
      console.log('Started listening - animations should be active now');
      
      toast({
        title: "🎤 Listening...",
        description: "Speak now! I'm listening to your voice. (Demo mode - will respond after 3 seconds)",
      });
      
      // Auto-stop listening after 3 seconds for demo
      setTimeout(() => {
        if (isListening) {
          handleMicToggle();
        }
      }, 3000);
    }
  }, [isListening, apiKey, sendMessage, toast]);

  const cardClasses = `relative border-2 shadow-2xl overflow-hidden backdrop-blur-sm ${
    darkMode 
      ? 'bg-gray-900/95 border-gray-700' 
      : 'bg-white/95 border-gray-300'
  }`;

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className={cardClasses}>
        {/* Header Section */}
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
                !apiKey?.trim() ? 'text-yellow-200' :
                'text-white/95'
              }`}>
                {getStatusText()}
              </p>
              
              {/* API Key Status */}
              {!apiKey?.trim() && (
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
        
        {/* Controls Section */}
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Main microphone button */}
            <Button
              onClick={handleMicToggle}
              disabled={!apiKey?.trim()}
              className={`relative py-6 px-12 rounded-full font-bold text-xl shadow-2xl transition-all duration-300 transform ${
                !apiKey?.trim()
                  ? 'bg-gray-400 cursor-not-allowed scale-95'
                  : isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white scale-110 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 mr-3" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 mr-3" />
                  {apiKey?.trim() ? 'Start Talking' : 'API Key Required'}
                </>
              )}
              
              {/* Animated ring for listening state */}
              {isListening && (
                <div className="absolute inset-0 border-4 border-red-400/50 rounded-full animate-ping"></div>
              )}
            </Button>

            {/* Instructions */}
            <div className="text-center space-y-2 max-w-md">
              {apiKey?.trim() ? (
                <>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {isListening 
                      ? "🎙️ Listening... Speak clearly!" 
                      : "Tap the button above to start a voice conversation"
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your conversation will also appear in Regular Chat
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Please set your Gemini API key in Regular Chat mode first
                </p>
              )}
            </div>

            {/* Debug info for development */}
            <div className="mt-4 text-center text-sm opacity-60">
              <p>Status: {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}</p>
              <p>API Key: {apiKey?.trim() ? 'Set ✅' : 'Missing ❌'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
