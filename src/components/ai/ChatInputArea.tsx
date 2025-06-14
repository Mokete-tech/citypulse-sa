
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";

interface ChatInputAreaProps {
  darkMode: boolean;
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  apiKey: string;
  isSpeechToTextEnabled: boolean;
  isListening: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onVoiceInput: () => void;
  onStopListening: () => void;
}

const ChatInputArea = ({
  darkMode,
  message,
  setMessage,
  isLoading,
  apiKey,
  isSpeechToTextEnabled,
  isListening,
  onSendMessage,
  onKeyPress,
  onVoiceInput,
  onStopListening
}: ChatInputAreaProps) => {
  return (
    <div className={`p-6 border-t-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
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
            onClick={onSendMessage}
            disabled={!message.trim() || isLoading || !apiKey}
            className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base"
          >
            <Send className="w-5 h-5 mr-2" />
            Ask PulsePal
          </Button>
          
          {isSpeechToTextEnabled && (
            <Button 
              onClick={isListening ? onStopListening : onVoiceInput}
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
  );
};

export default ChatInputArea;
