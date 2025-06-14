
import { memo } from 'react';

interface LiveChatStatusProps {
  isListening: boolean;
  isSpeaking: boolean;
  hasApiKey: boolean;
}

const LiveChatStatus = memo(({ isListening, isSpeaking, hasApiKey }: LiveChatStatusProps) => {
  const getEmoji = () => {
    if (isSpeaking) return '🗣️';
    if (isListening) return '👂';
    return '🤖';
  };

  const getStatusText = () => {
    if (isListening) return '👂 Listening to you...';
    if (isSpeaking) return '🗣️ PulsePal is speaking...';
    if (!hasApiKey) return '🔑 API Key needed to start chatting';
    return '😊 Ready to chat - Click Start Talking!';
  };

  const getStatusColor = () => {
    if (isSpeaking) return 'text-green-200';
    if (isListening) return 'text-blue-200';
    if (!hasApiKey) return 'text-yellow-200';
    return 'text-white/95';
  };

  return (
    <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-pulse"></div>
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

        {/* Simple Emoji Display */}
        <div className="relative my-8">
          <div className={`text-[200px] leading-none transition-all duration-500 ${
            isSpeaking ? 'animate-pulse scale-110' :
            isListening ? 'animate-bounce scale-105' :
            'scale-100'
          }`}>
            {getEmoji()}
          </div>
          
          {/* Simple glow effect */}
          <div className={`absolute inset-0 rounded-full blur-3xl scale-75 -z-10 transition-all duration-500 ${
            isSpeaking ? 'bg-green-400/40' :
            isListening ? 'bg-blue-400/40' :
            'bg-white/20'
          }`}></div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <p className={`text-xl font-medium transition-all duration-300 ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          
          {/* API Key Status */}
          {!hasApiKey && (
            <div className="flex items-center justify-center space-x-3 bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/30">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-ping"></span>
              <span className="text-sm font-medium text-yellow-100">
                Set your API Key above to enable Live Voice Chat
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LiveChatStatus.displayName = 'LiveChatStatus';

export default LiveChatStatus;
