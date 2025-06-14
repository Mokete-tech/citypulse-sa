
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Zap,
  Radio,
  Waves,
  Heart
} from 'lucide-react';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = ({ darkMode }: LiveChatInterfaceProps) => {
  const [textInput, setTextInput] = useState('');
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
  } = useGeminiLive();

  // Fun animated background particles
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Create animated particles for the background
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const handleSendText = () => {
    if (textInput.trim() && isConnected) {
      sendText(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `linear-gradient(45deg, #8b5cf6, #06b6d4)`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Live Chat Card */}
      <Card className={`relative border-2 shadow-2xl overflow-hidden ${
        darkMode 
          ? 'bg-gray-800/90 border-purple-500/50' 
          : 'bg-white/90 border-purple-200'
      } backdrop-blur-sm`}>
        
        {/* Animated header with live indicator */}
        <div className={`relative p-6 ${
          isConnected 
            ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' 
            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
        } text-white overflow-hidden`}>
          
          {/* Animated wave background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-white/20' : 'bg-white/10'
                } backdrop-blur-sm border-2 border-white/30`}>
                  <Radio className={`w-6 h-6 ${isConnected ? 'animate-pulse' : ''}`} />
                </div>
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  🎤 Live Chat with PulsePal
                  <Sparkles className="w-5 h-5 ml-2 animate-bounce" />
                </h2>
                <p className="text-sm opacity-90 flex items-center">
                  {isConnected ? (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Connected • Real-time voice chat active
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Disconnected • Click connect to start
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-3">
              {isListening && (
                <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-300">
                  <Waves className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
              )}
              {isSpeaking && (
                <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-300">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="text-sm font-medium">Speaking...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          
          {/* Connection Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isConnected ? (
              <Button 
                onClick={connect}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Connect to Live Chat
              </Button>
            ) : (
              <Button 
                onClick={disconnect}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <VolumeX className="w-5 h-5 mr-2" />
                Disconnect
              </Button>
            )}
          </div>

          {/* Voice Controls - Only show when connected */}
          {isConnected && (
            <Card className={`border-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-purple-500" />
                  Voice Controls
                </h3>
                
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    onClick={handleMicToggle}
                    disabled={!isConnected}
                    className={`relative py-4 px-8 rounded-xl font-medium transition-all duration-300 ${
                      isListening
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105'
                    } shadow-lg hover:shadow-xl`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-6 h-6 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="w-6 h-6 mr-2" />
                        Start Listening
                      </>
                    )}
                    
                    {/* Pulsing ring for listening state */}
                    {isListening && (
                      <div className="absolute inset-0 rounded-xl border-2 border-white/50 animate-ping"></div>
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
                  🎤 Click to start talking with PulsePal AI in real-time!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Text Input - Only show when connected */}
          {isConnected && (
            <Card className={`border-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                  Or Type a Message
                </h3>
                
                <div className="flex space-x-3">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to PulsePal..."
                    className={`flex-1 border-2 rounded-xl ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-purple-300 bg-white/50'} focus:border-purple-500 transition-all duration-200 text-base backdrop-blur-sm`}
                  />
                  <Button
                    onClick={handleSendText}
                    disabled={!textInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages Display */}
          {messages.length > 0 && (
            <Card className={`border-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-purple-50 border-gray-200'} backdrop-blur-sm max-h-96 overflow-y-auto`}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  Conversation History
                </h3>
                
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        message.type === 'text'
                          ? message.text?.startsWith('User:') 
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 ml-8'
                            : 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mr-8'
                          : 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30'
                      } border border-gray-200 dark:border-gray-600 shadow-sm animate-fade-in`}
                    >
                      {message.text && (
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      )}
                      {message.type === 'audio' && (
                        <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-sm">Audio response received</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fun Getting Started Section */}
          {!isConnected && (
            <Card className={`border-2 border-dashed ${darkMode ? 'border-purple-500/50 bg-purple-900/20' : 'border-purple-300 bg-purple-50/50'} backdrop-blur-sm`}>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Ready for Real-Time Magic? ✨
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Connect to start having natural voice conversations with PulsePal AI! 
                    Experience the future of AI interaction - no typing needed, just talk naturally!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                    <Mic className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="font-medium">Voice Chat</span>
                    <span className="text-xs text-gray-500">Natural conversation</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                    <Zap className="w-8 h-8 text-green-500 mb-2" />
                    <span className="font-medium">Real-Time</span>
                    <span className="text-xs text-gray-500">Instant responses</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30">
                    <Heart className="w-8 h-8 text-pink-500 mb-2" />
                    <span className="font-medium">Smart</span>
                    <span className="text-xs text-gray-500">Context-aware AI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatInterface;
