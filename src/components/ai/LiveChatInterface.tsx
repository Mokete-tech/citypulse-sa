
import { useState, useCallback, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LiveChatHeader from './live-chat/LiveChatHeader';
import LiveChatControls from './live-chat/LiveChatControls';
import LiveChatWelcome from './live-chat/LiveChatWelcome';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = memo(({ darkMode }: LiveChatInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleMicToggle = useCallback(() => {
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
      
      // Simulate speaking response after 3 seconds
      setTimeout(() => {
        setIsSpeaking(true);
        setIsListening(false);
        
        // Stop speaking after 2 seconds
        setTimeout(() => {
          setIsSpeaking(false);
        }, 2000);
      }, 3000);
    }
  }, [isListening, toast]);

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
        />
        
        <CardContent className="p-6 space-y-6">
          <LiveChatControls
            isListening={isListening}
            onMicToggle={handleMicToggle}
          />

          <LiveChatWelcome darkMode={darkMode} />
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
