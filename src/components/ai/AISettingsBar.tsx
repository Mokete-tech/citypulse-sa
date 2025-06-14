
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Key } from "lucide-react";

interface AISettingsBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  apiKey: string;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (value: boolean) => void;
}

const AISettingsBar = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  apiKey,
  showApiKeyInput,
  setShowApiKeyInput
}: AISettingsBarProps) => {
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
          className={`transition-all duration-200 ${apiKey ? "border-green-500 text-green-600 bg-green-50 hover:bg-green-100" : "hover:scale-105"}`}
        >
          <Key className="w-4 h-4 mr-2" />
          {apiKey ? "API Key Set" : "Set API Key"}
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
