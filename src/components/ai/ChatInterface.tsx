
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, Bot, User, Sparkles, Volume2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage } from "@/hooks/useAI";

interface ChatInterfaceProps {
  darkMode: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  apiKey: string;
  sendMessage: (message: string) => void;
}

const ChatInterface = ({
  darkMode,
  messages,
  isLoading,
  apiKey,
  sendMessage
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Play sound effects
  const playSound = (type: 'send' | 'receive') => {
    if (!audioRef.current) return;
    
    // Create different tones for send vs receive
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'send') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.15);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Text-to-speech for AI responses
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 0.7;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
      playSound('send');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice input functionality
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      playSound('send');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Play sound when AI responds
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        playSound('receive');
        // Auto-speak AI responses (optional)
        // speakMessage(lastMessage.content);
      }
    }
  }, [messages]);

  return (
    <Card className={`mb-6 border-2 shadow-2xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
      <CardContent className="p-6">
        <div className={`min-h-[400px] max-h-[500px] overflow-y-auto mb-6 p-6 rounded-2xl border-2 ${darkMode ? 'border-gray-600 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/2 transform translate-x-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Hi! I'm PulsePal 👋
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Your AI assistant powered by Gemini, ready to help you discover amazing deals and events!
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                🎤 Try voice input or 🔊 enable text-to-speech for accessibility!
              </p>
              {!apiKey && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    ⚠️ Please set your Gemini API key to start chatting
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                        : `${darkMode ? 'bg-gray-700' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} text-gray-900 dark:text-gray-100 hover:scale-105`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs opacity-70">
                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                          </span>
                          {msg.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(msg.content)}
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className={`max-w-[80%] rounded-2xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about deals and events... 🎤 or use voice!"
              className={`min-h-[100px] pr-20 border-2 rounded-xl ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} focus:border-purple-500 transition-all duration-200`}
              maxLength={500}
              disabled={isLoading || !apiKey}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {message.length}/500
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading || !apiKey}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Send className="w-4 h-4 mr-2" />
              Ask PulsePal
            </Button>
            <Button 
              variant="outline" 
              onClick={handleVoiceInput}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isListening 
                  ? "bg-red-100 border-red-300 text-red-600 hover:bg-red-200 animate-pulse" 
                  : "border-gray-300 hover:border-purple-400"
              }`}
              disabled={isLoading || !apiKey}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-red-600" : ""}`} />
            </Button>
          </div>
        </div>
        
        {/* Hidden audio element for sound effects */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
