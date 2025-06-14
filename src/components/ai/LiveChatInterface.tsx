
import { useState, useCallback, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import LiveChatHeader from './live-chat/LiveChatHeader';
import LiveChatControls from './live-chat/LiveChatControls';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = memo(({ darkMode }: LiveChatInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { apiKey, sendMessage, isLoading } = useAI();
  const { toast } = useToast();

  const handleMicToggle = useCallback(async () => {
    if (!apiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in Regular Chat mode first",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // Stop listening
      setIsListening(false);
      toast({
        title: "Stopped listening",
        description: "Tap the button to start talking again",
      });
    } else {
      // Start listening
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now! I'm listening to your voice.",
      });
      
      // Simulate a voice interaction
      setTimeout(async () => {
        setIsSpeaking(true);
        setIsListening(false);
        
        // Send a demo message to show it's working
        await sendMessage("Hello PulsePal! I'm testing the voice chat feature. Can you tell me about some deals in Cape Town?");
        
        toast({
          title: "AI Response",
          description: "PulsePal is responding! Check the Regular Chat for the full conversation.",
        });
        
        // Stop speaking after 3 seconds
        setTimeout(() => {
          setIsSpeaking(false);
        }, 3000);
      }, 2000);
    }
  }, [isListening, apiKey, sendMessage, toast]);

  const cardClasses = `relative border-2 shadow-xl overflow-hidden ${
    darkMode 
      ? 'bg-gray-800/95 border-gray-600' 
      : 'bg-white/95 border-gray-200'
  }`;

  return (
    <div className="relative">
      <Card className={cardClasses}>
        <LiveChatHeader 
          isListening={isListening}
          isSpeaking={isSpeaking}
          hasApiKey={!!apiKey?.trim()}
        />
        
        <CardContent className="p-8 space-y-8">
          <LiveChatControls
            isListening={isListening}
            onMicToggle={handleMicToggle}
            hasApiKey={!!apiKey?.trim()}
          />
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
