
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Key, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AISettingsBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  apiKey: string;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (value: boolean) => void;
  isLoadingApiKey?: boolean;
}

const AISettingsBar = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  apiKey,
  showApiKeyInput,
  setShowApiKeyInput,
  isLoadingApiKey = false
}: AISettingsBarProps) => {
  const { user } = useAuth();

  const getApiKeyButtonContent = () => {
    if (isLoadingApiKey) {
      return (
        <>
          <Key className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      );
    }
    
    if (apiKey) {
      return (
        <>
          <Key className="w-4 h-4 mr-2" />
          {user ? "API Key Saved" : "API Key Set"}
        </>
      );
    }
    
    return (
      <>
        <Key className="w-4 h-4 mr-2" />
        Set API Key
      </>
    );
  };

  const getApiKeyButtonStyle = () => {
    if (apiKey) {
      if (user) {
        return "border-green-500 text-green-600 bg-green-50 hover:bg-green-100";
      } else {
        return "border-orange-500 text-orange-600 bg-orange-50 hover:bg-orange-100";
      }
    }
    
    return "hover:scale-105";
  };

  return (
    <div className={`flex flex-wrap items-center justify-between mb-8 gap-4 p-4 rounded-2xl backdrop-blur-sm border ${darkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-white/60 border-white/80'} shadow-lg`}>
      <div className="flex items-center space-x-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className={`w-32 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white/80'}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="afrikaans">Afrikaans</SelectItem>
            <SelectItem value="zulu">Zulu</SelectItem>
            <SelectItem value="xhosa">Xhosa</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          disabled={isLoadingApiKey}
          className={`transition-all duration-200 ${getApiKeyButtonStyle()}`}
        >
          {getApiKeyButtonContent()}
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4 text-yellow-500" />
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          <Moon className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium">Dark Mode</span>
        </div>
      </div>
    </div>
  );
};

export default AISettingsBar;
