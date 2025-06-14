
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Sparkles } from "lucide-react";
import { useGeminiLive } from "@/hooks/useGeminiLive";

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = ({ darkMode }: LiveChatInterfaceProps) => {
  const [textInput, setTextInput] = useState("");
  
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

  const handleSendText = () => {
    if (textInput.trim()) {
      sendText(textInput);
      setTextInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status & Controls */}
      <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500/50' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isConnected 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                } shadow-lg`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Gemini Live Chat
                </h3>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant={isConnected ? "default" : "secondary"} className="px-3 py-1">
                    {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                  </Badge>
                  
                  {isListening && (
                    <Badge variant="outline" className="px-3 py-1 border-green-400 text-green-600 animate-pulse">
                      🎤 Listening...
                    </Badge>
                  )}
                  
                  {isSpeaking && (
                    <Badge variant="outline" className="px-3 py-1 border-blue-400 text-blue-600 animate-pulse">
                      🔊 Speaking...
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isConnected ? (
                <Button
                  onClick={connect}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Connect Live
                </Button>
              ) : (
                <Button
                  onClick={disconnect}
                  variant="destructive"
                  className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  Disconnect
                </Button>
              )}
            </div>
          </div>

          {/* Voice Controls */}
          {isConnected && (
            <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`w-20 h-20 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">
                  {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 AI Speaking..." : "Press to Talk"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time voice conversation with Gemini AI
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages Display */}
      {messages.length > 0 && (
        <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Conversation Log
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.type === 'text' 
                      ? `${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} border`
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {msg.type === 'text' ? '💬 Text' : '🔊 Audio'}
                    </Badge>
                  </div>
                  {msg.text && (
                    <p className="text-sm">{msg.text}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input (when connected) */}
      {isConnected && (
        <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Or type your message here..."
                className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                  darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-purple-300 bg-white/50'
                } focus:border-purple-500 transition-all duration-200 backdrop-blur-sm`}
                disabled={isListening || isSpeaking}
              />
              <Button
                onClick={handleSendText}
                disabled={!textInput.trim() || isListening || isSpeaking}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveChatInterface;
