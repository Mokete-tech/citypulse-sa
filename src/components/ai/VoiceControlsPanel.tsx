
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Mic, Play, Pause } from "lucide-react";

interface VoiceControlsPanelProps {
  darkMode: boolean;
  isTextToSpeechEnabled: boolean;
  setIsTextToSpeechEnabled: (enabled: boolean) => void;
  isSpeechToTextEnabled: boolean;
  setIsSpeechToTextEnabled: (enabled: boolean) => void;
  volume: number[];
  setVolume: (volume: number[]) => void;
  isSpeaking: boolean;
  isListening: boolean;
  onTestVoice: () => void;
  onStopSpeaking: () => void;
}

const VoiceControlsPanel = ({
  darkMode,
  isTextToSpeechEnabled,
  setIsTextToSpeechEnabled,
  isSpeechToTextEnabled,
  setIsSpeechToTextEnabled,
  volume,
  setVolume,
  isSpeaking,
  isListening,
  onTestVoice,
  onStopSpeaking
}: VoiceControlsPanelProps) => {
  return (
    <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500/50' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            {/* Text-to-Speech Toggle */}
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-purple-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Text-to-Speech</span>
                <Switch 
                  checked={isTextToSpeechEnabled}
                  onCheckedChange={setIsTextToSpeechEnabled}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Volume Control */}
            {isTextToSpeechEnabled && (
              <div className="flex items-center space-x-3 min-w-[120px]">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* Speech-to-Text Toggle */}
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Speech-to-Text</span>
                <Switch 
                  checked={isSpeechToTextEnabled}
                  onCheckedChange={setIsSpeechToTextEnabled}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Voice Control Actions */}
          <div className="flex items-center space-x-2">
            {isTextToSpeechEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTestVoice}
                disabled={isSpeaking}
                className="hover:scale-105 transition-transform"
              >
                <Play className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            )}
            
            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStopSpeaking}
                className="text-red-600 hover:bg-red-50 hover:scale-105 transition-transform"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}

            {/* Status Indicators */}
            {(isListening || isSpeaking) && (
              <div className="flex items-center space-x-3 px-3 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full">
                {isListening && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Listening...</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Speaking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceControlsPanel;
