
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, User, Volume2, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage } from "@/hooks/useAI";

interface ChatMessagesAreaProps {
  darkMode: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  apiKey: string;
  isTextToSpeechEnabled: boolean;
  onSpeakMessage: (text: string) => void;
}

const ChatMessagesArea = ({
  darkMode,
  messages,
  isLoading,
  apiKey,
  isTextToSpeechEnabled,
  onSpeakMessage
}: ChatMessagesAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
                          onClick={() => onSpeakMessage(msg.content)}
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
  );
};

export default ChatMessagesArea;
