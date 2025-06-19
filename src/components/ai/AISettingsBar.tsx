
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";

interface AISettingsBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
}

const AISettingsBar = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage
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
