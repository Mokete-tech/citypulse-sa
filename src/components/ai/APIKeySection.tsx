
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink } from "lucide-react";

interface APIKeySectionProps {
  darkMode: boolean;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (value: boolean) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
}

const APIKeySection = ({
  darkMode,
  showApiKeyInput,
  setShowApiKeyInput,
  apiKey,
  setApiKey
}: APIKeySectionProps) => {
  if (!showApiKeyInput) return null;

  return (
    <Card className={`mb-6 border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Gemini API Key Configuration
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div>
          <Input
            type="password"
            placeholder="Enter your Gemini API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-2">
            Your API key is stored locally and never sent to our servers. 
            Get a free Gemini API key from Google AI Studio.
          </p>
        </div>
        <Button
          onClick={() => setShowApiKeyInput(false)}
          disabled={!apiKey.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Save API Key
        </Button>
      </CardContent>
    </Card>
  );
};

export default APIKeySection;
