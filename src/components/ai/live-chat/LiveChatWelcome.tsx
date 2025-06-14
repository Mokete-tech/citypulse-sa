
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Mic, Zap, Heart } from 'lucide-react';

interface LiveChatWelcomeProps {
  darkMode: boolean;
}

const LiveChatWelcome = ({ darkMode }: LiveChatWelcomeProps) => {
  return (
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
  );
};

export default LiveChatWelcome;
