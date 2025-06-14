
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, ExternalLink, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [tempApiKey, setTempApiKey] = useState(liveApiKey);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Gemini API key",
        variant: "destructive"
      });
      return;
    }

    setLiveApiKey(tempApiKey.trim());
    setIsSaved(true);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for Live Chat",
    });

    // Reset the saved indicator after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };

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
            value={tempApiKey}
            onChange={(e) => {
              setTempApiKey(e.target.value);
              setIsSaved(false);
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSaveApiKey}
            disabled={!tempApiKey.trim() || tempApiKey === liveApiKey}
            className={`min-w-[120px] transition-all duration-200 ${
              isSaved 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              tempApiKey.trim() && tempApiKey !== liveApiKey ? 'Save Key' : 'Enter Key'
            )}
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
