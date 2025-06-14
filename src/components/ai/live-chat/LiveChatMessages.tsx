
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Volume2 } from 'lucide-react';

interface GeminiLiveMessage {
  type: 'audio' | 'text' | 'error' | 'setup';
  data?: any;
  audio?: string;
  text?: string;
  error?: string;
}

interface LiveChatMessagesProps {
  messages: GeminiLiveMessage[];
  darkMode: boolean;
}

const LiveChatMessages = ({ messages, darkMode }: LiveChatMessagesProps) => {
  return (
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
  );
};

export default LiveChatMessages;
