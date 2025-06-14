
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, ExternalLink } from 'lucide-react';

interface LiveChatApiKeySectionProps {
  darkMode: boolean;
  liveApiKey: string;
  setLiveApiKey: (key: string) => void;
}

const LiveChatApiKeySection = ({ 
  darkMode, 
  liveApiKey, 
  setLiveApiKey 
}: LiveChatApiKeySectionProps) => {
  return (
    <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center font-semibold">
            <Key className="w-5 h-5 mr-2" />
            Live Chat API Key
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
            className="text-white hover:bg-white/20"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Get API Key
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Input
            type="password"
            placeholder="Enter your Gemini API key for Live Chat..."
            value={liveApiKey}
            onChange={(e) => setLiveApiKey(e.target.value)}
            className="flex-1"
          />
          <Button
            disabled={!liveApiKey.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {liveApiKey ? 'API Key Set' : 'Save Key'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This API key is separate from Regular Chat and stored locally for Live Chat only.
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveChatApiKeySection;
