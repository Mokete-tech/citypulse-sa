
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Mic, MicOff, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceControlsProps {
  darkMode: boolean;
}

const VoiceControls = ({ darkMode }: VoiceControlsProps) => {
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isSpeechToTextEnabled, setIsSpeechToTextEnabled] = useState(false);
  const [volume, setVolume] = useState([0.7]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Initialize speech synthesis
  const initializeSpeech = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      return true;
    }
    return false;
  };

  // Initialize speech recognition
  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      return true;
    }
    return false;
  };

  const speakText = (text: string) => {
    if (!initializeSpeech() || !synthRef.current) {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }

    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume[0];
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text.",
        variant: "destructive"
      });
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!initializeRecognition() || !recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // You can emit this transcript to parent component if needed
      console.log('Voice input:', transcript);
      
      toast({
        title: "Voice Input Captured",
        description: `"${transcript}"`,
      });
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        title: "Recognition Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <Card className={`mb-6 border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
      <CardHeader className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-t-lg`}>
        <CardTitle className="flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-purple-500" />
          Voice Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Text-to-Speech Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Text-to-Speech</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hear AI responses read aloud
              </p>
            </div>
            <Switch 
              checked={isTextToSpeechEnabled}
              onCheckedChange={setIsTextToSpeechEnabled}
            />
          </div>
          
          {isTextToSpeechEnabled && (
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
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
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText("Hello! This is a test of the text to speech functionality.")}
                  disabled={isSpeaking}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Voice
                </Button>
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Speech-to-Text Controls */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Speech-to-Text</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send voice messages to PulsePal
              </p>
            </div>
            <Switch 
              checked={isSpeechToTextEnabled}
              onCheckedChange={setIsSpeechToTextEnabled}
            />
          </div>
          
          {isSpeechToTextEnabled && (
            <div className="flex space-x-2">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className="flex-1"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Input
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
            {isListening && (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Speaking...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceControls;
