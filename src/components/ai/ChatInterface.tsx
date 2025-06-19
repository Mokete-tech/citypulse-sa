
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/hooks/useAI";
import VoiceControlsPanel from "./VoiceControlsPanel";
import ChatMessagesArea from "./ChatMessagesArea";
import ChatInputArea from "./ChatInputArea";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useSoundEffects } from "./useSoundEffects";

interface ChatInterfaceProps {
  darkMode: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => void;
}

const ChatInterface = ({
  darkMode,
  messages,
  isLoading,
  sendMessage
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isSpeechToTextEnabled, setIsSpeechToTextEnabled] = useState(false);
  const [volume, setVolume] = useState([0.7]);
  
  const { startListening, stopListening } = useSpeechRecognition();
  const { speakMessage, stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const { playSound } = useSoundEffects();

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
      playSound('send');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    startListening(
      (transcript) => {
        setMessage(transcript);
      },
      () => {
        setIsListening(true);
        playSound('send');
      },
      () => setIsListening(false)
    );
  };

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
  };

  const handleTestVoice = () => {
    speakMessage("Hello! This is a test of the text to speech functionality.", volume[0]);
  };

  const handleSpeakMessage = (text: string) => {
    speakMessage(text, volume[0]);
  };

  // Auto-speak AI responses when TTS is enabled
  useEffect(() => {
    if (messages.length > 0 && isTextToSpeechEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        playSound('receive');
        speakMessage(lastMessage.content, volume[0]);
      }
    }
  }, [messages, isTextToSpeechEnabled, volume, playSound, speakMessage]);

  return (
    <div className="space-y-6">
      {/* Voice Controls Panel */}
      <VoiceControlsPanel
        darkMode={darkMode}
        isTextToSpeechEnabled={isTextToSpeechEnabled}
        setIsTextToSpeechEnabled={setIsTextToSpeechEnabled}
        isSpeechToTextEnabled={isSpeechToTextEnabled}
        setIsSpeechToTextEnabled={setIsSpeechToTextEnabled}
        volume={volume}
        setVolume={setVolume}
        isSpeaking={isSpeaking}
        isListening={isListening}
        onTestVoice={handleTestVoice}
        onStopSpeaking={stopSpeaking}
      />

      {/* Chat Interface */}
      <Card className={`border-2 shadow-2xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm overflow-hidden`}>
        <CardContent className="p-0">
          {/* Messages Area */}
          <ChatMessagesArea
            darkMode={darkMode}
            messages={messages}
            isLoading={isLoading}
            isTextToSpeechEnabled={isTextToSpeechEnabled}
            onSpeakMessage={handleSpeakMessage}
          />

          {/* Input Area */}
          <ChatInputArea
            darkMode={darkMode}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            isSpeechToTextEnabled={isSpeechToTextEnabled}
            isListening={isListening}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onVoiceInput={handleVoiceInput}
            onStopListening={handleStopListening}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
