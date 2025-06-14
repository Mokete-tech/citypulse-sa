
import { memo } from 'react';
import { useAI } from '@/hooks/useAI';
import AnimatedBot from './AnimatedBot';

interface LiveChatHeaderProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const LiveChatHeader = memo(({ isListening, isSpeaking }: LiveChatHeaderProps) => {
  const { apiKey } = useAI();
  const isConnected = !!apiKey;

  return (
    <div className="relative p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            🎤 Voice Chat
          </h2>
          <p className="text-sm opacity-90">
            Talk naturally with PulsePal AI
          </p>
        </div>

        {/* Large Animated Bot */}
        <AnimatedBot 
          isConnected={isConnected}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />

        {/* Simple Status */}
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Need API Key'}
          </span>
        </div>
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
