
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  const [localApiKey, setLocalApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  if (!showApiKeyInput) return null;

  const handleSaveApiKey = async () => {
    if (!localApiKey.trim()) return;
    
    setIsSaving(true);
    try {
      if (user) {
        // If user is authenticated, save securely
        await setApiKey(localApiKey);
      } else {
        // If no user, just set in state (temporary)
        setApiKey(localApiKey);
      }
      setLocalApiKey("");
      setShowApiKeyInput(false);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTempApiKey = () => {
    if (!localApiKey.trim()) return;
    setApiKey(localApiKey);
    setLocalApiKey("");
    setShowApiKeyInput(false);
  };

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
        {apiKey ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={showKey ? apiKey : "••••••••••••••••••••••••••••••••"}
                  readOnly
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ API key is securely saved and encrypted
                </p>
              ) : (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ API key is stored temporarily (sign in to save permanently)
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setLocalApiKey("");
                  setShowKey(false);
                }}
              >
                Update Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter your Gemini API key..."
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="w-full"
              />
              {!user && (
                <p className="text-sm text-orange-500 mt-2 flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Without signing in, your API key will only be stored temporarily in this session.
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Get a free Gemini API key from Google AI Studio.
              </p>
            </div>
            <div className="space-y-2">
              {user ? (
                <Button
                  onClick={handleSaveApiKey}
                  disabled={!localApiKey.trim() || isSaving}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isSaving ? "Saving..." : "Save API Key Securely"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleTempApiKey}
                    disabled={!localApiKey.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Use API Key (This Session)
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Sign in to save your API key permanently and securely
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APIKeySection;
