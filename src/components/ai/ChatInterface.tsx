
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Mic, Send, Bot, User, Sparkles, Volume2, VolumeX, MicOff, Play, Pause } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isSpeechToTextEnabled, setIsSpeechToTextEnabled] = useState(false);
  const [volume, setVolume] = useState([0.7]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech synthesis
  const initializeSpeech = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      return true;
    }
    return false;
  };

  // Initialize speech recognition
  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      return true;
    }
    return false;
  };

  // Play sound effects
  const playSound = (type: 'send' | 'receive') => {
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
    if (!initializeSpeech() || !synthRef.current) {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume[0];
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text.",
        variant: "destructive"
      });
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
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
    if (!initializeRecognition() || !recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
      
      toast({
        title: "Voice Input Captured",
        description: `"${transcript}"`,
      });
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        title: "Recognition Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    playSound('send');
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Auto-speak AI responses when TTS is enabled
  useEffect(() => {
    if (messages.length > 0 && isTextToSpeechEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        playSound('receive');
        speakMessage(lastMessage.content);
      }
    }
  }, [messages, isTextToSpeechEnabled]);

  return (
    <div className="space-y-6">
      {/* Voice Controls Panel */}
      <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500/50' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              {/* Text-to-Speech Toggle */}
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-purple-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Text-to-Speech</span>
                  <Switch 
                    checked={isTextToSpeechEnabled}
                    onCheckedChange={setIsTextToSpeechEnabled}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Volume Control */}
              {isTextToSpeechEnabled && (
                <div className="flex items-center space-x-3 min-w-[120px]">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    min={0}
                    step={0.1}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Speech-to-Text Toggle */}
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Speech-to-Text</span>
                  <Switch 
                    checked={isSpeechToTextEnabled}
                    onCheckedChange={setIsSpeechToTextEnabled}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Voice Control Actions */}
            <div className="flex items-center space-x-2">
              {isTextToSpeechEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakMessage("Hello! This is a test of the text to speech functionality.")}
                  disabled={isSpeaking}
                  className="hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Voice
                </Button>
              )}
              
              {isSpeaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeaking}
                  className="text-red-600 hover:bg-red-50 hover:scale-105 transition-transform"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}

              {/* Status Indicators */}
              {(isListening || isSpeaking) && (
                <div className="flex items-center space-x-3 px-3 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full">
                  {isListening && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">Listening...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">Speaking...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className={`border-2 shadow-2xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm overflow-hidden`}>
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className={`min-h-[500px] max-h-[600px] overflow-y-auto p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-gradient-to-br from-purple-50/50 to-blue-50/50'}`}>
            {messages.length === 0 ? (
              <div className="text-center mt-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Bot className="w-16 h-16 text-white" />
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-1/2 transform translate-x-12 animate-bounce" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Hey there! I'm PulsePal 👋
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                  Your AI-powered city companion, ready to help you discover amazing deals and events!
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">Voice-Enabled</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">Speech Recognition</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span className="text-sm text-pink-700 dark:text-pink-300">AI-Powered</span>
                  </div>
                </div>
                {!apiKey && (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-600 rounded-2xl p-6 max-w-md mx-auto">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
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
                      className={`max-w-[80%] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:scale-105 transform'
                          : `${darkMode ? 'bg-gray-700/90' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-purple-200'} text-gray-900 dark:text-gray-100 hover:scale-105 transform hover:border-purple-400`
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'user' 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}>
                          {msg.role === 'user' ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs opacity-70 font-medium">
                              {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                            </span>
                            {msg.role === 'assistant' && isTextToSpeechEnabled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakMessage(msg.content)}
                                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 hover:scale-110 transition-all"
                              >
                                <Volume2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className={`max-w-[80%] rounded-2xl p-6 ${darkMode ? 'bg-gray-700/90' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-purple-200'} shadow-lg`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
          <div className={`p-6 border-t-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about deals and events... 🎤 or use voice!"
                  className={`min-h-[80px] pr-20 border-2 rounded-xl ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-purple-300 bg-white/50'} focus:border-purple-500 transition-all duration-200 text-base backdrop-blur-sm`}
                  maxLength={500}
                  disabled={isLoading || !apiKey}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400 font-medium">
                  {message.length}/500
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading || !apiKey}
                  className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Ask PulsePal
                </Button>
                
                {isSpeechToTextEnabled && (
                  <Button 
                    onClick={isListening ? stopListening : handleVoiceInput}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isListening 
                        ? "bg-red-100 border-red-300 text-red-600 hover:bg-red-200 animate-pulse" 
                        : "border-purple-300 hover:border-purple-400 bg-white/50 hover:bg-purple-50"
                    }`}
                    disabled={isLoading || !apiKey}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
