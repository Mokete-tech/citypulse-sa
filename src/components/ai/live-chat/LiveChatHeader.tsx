
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
    <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            🎤 PulsePal Live Chat
          </h2>
          <p className="text-sm opacity-90">
            Your AI voice companion
          </p>
        </div>

        {/* Animated Bot */}
        <AnimatedBot 
          isConnected={isConnected}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />

        {/* Status */}
        <div className="flex items-center space-x-2 text-center">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
          <span className="text-sm">
            {isConnected ? 'Ready for voice chat' : 'API key needed'}
          </span>
        </div>
      </div>
    </div>
  );
});

LiveChatHeader.displayName = 'LiveChatHeader';

export default LiveChatHeader;
