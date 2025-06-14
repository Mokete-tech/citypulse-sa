
import { useState, useCallback, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LiveChatApiKeySection from './live-chat/LiveChatApiKeySection';
import LiveChatStatus from './live-chat/LiveChatStatus';
import LiveChatMainButton from './live-chat/LiveChatMainButton';

interface LiveChatInterfaceProps {
  darkMode: boolean;
  sendMessage: (content: string) => void;
}

const LiveChatInterface = memo(({ darkMode, sendMessage }: LiveChatInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveApiKey, setLiveApiKey] = useState('');
  
  const { toast } = useToast();

  console.log('Live Chat - API Key status:', liveApiKey ? 'Available' : 'Not set');

  const handleMicToggle = useCallback(async () => {
    if (!liveApiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key for Live Chat first",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      
      // Simulate AI response
      setTimeout(() => {
        setIsSpeaking(true);
        sendMessage("Hello! I heard you speaking in live voice chat. This is a demo response from PulsePal AI.");
        
        setTimeout(() => {
          setIsSpeaking(false);
          toast({
            title: "Voice interaction complete",
            description: "Check Regular Chat to see the full conversation!",
          });
        }, 4000);
      }, 1000);
      
    } else {
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak now! I'm listening to your voice.",
      });
      
      // Auto-stop listening after 5 seconds for demo
      setTimeout(() => {
        if (isListening) {
          handleMicToggle();
        }
      }, 5000);
    }
  }, [isListening, liveApiKey, sendMessage, toast]);

  const hasApiKey = Boolean(liveApiKey?.trim());

  return (
    <div className="relative max-w-4xl mx-auto space-y-6">
      {/* API Key Section */}
      <LiveChatApiKeySection
        darkMode={darkMode}
        liveApiKey={liveApiKey}
        setLiveApiKey={setLiveApiKey}
      />

      {/* Main Chat Interface */}
      <Card className={`relative border-2 shadow-2xl overflow-hidden backdrop-blur-sm ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-300'
      }`}>
        {/* Status Display */}
        <LiveChatStatus
          isListening={isListening}
          isSpeaking={isSpeaking}
          hasApiKey={hasApiKey}
        />
        
        {/* Controls Section */}
        <CardContent className="p-8">
          <LiveChatMainButton
            isListening={isListening}
            hasApiKey={hasApiKey}
            onMicToggle={handleMicToggle}
          />
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
