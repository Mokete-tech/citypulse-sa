
import { useState, useCallback, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import LiveChatHeader from './LiveChatHeader';
import LiveChatControls from './LiveChatControls';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = memo(({ darkMode }: LiveChatInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { apiKey, sendMessage } = useAI();
  const { toast } = useToast();

  const handleMicToggle = useCallback(async () => {
    if (!apiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in Regular Chat mode first to use voice chat",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      // Stop listening
      setIsListening(false);
      console.log('Stopped listening');
      
      // Simulate processing and then speaking
      setTimeout(() => {
        setIsSpeaking(true);
        console.log('AI is now speaking');
        
        // Send a message to demonstrate the connection
        sendMessage("Hello! I heard you speaking in voice chat. This is a demo response from PulsePal AI.");
        
        // Stop speaking after 4 seconds
        setTimeout(() => {
          setIsSpeaking(false);
          console.log('AI finished speaking');
          
          toast({
            title: "Voice interaction complete",
            description: "Check Regular Chat to see the full conversation!",
          });
        }, 4000);
      }, 1000);
      
    } else {
      // Start listening
      setIsListening(true);
      console.log('Started listening - animations should be active now');
      
      toast({
        title: "🎤 Listening...",
        description: "Speak now! I'm listening to your voice. (Demo mode - will respond after 3 seconds)",
      });
      
      // Auto-stop listening after 3 seconds for demo
      setTimeout(() => {
        if (isListening) {
          handleMicToggle();
        }
      }, 3000);
    }
  }, [isListening, apiKey, sendMessage, toast]);

  const cardClasses = `relative border-2 shadow-2xl overflow-hidden backdrop-blur-sm ${
    darkMode 
      ? 'bg-gray-900/95 border-gray-700' 
      : 'bg-white/95 border-gray-300'
  }`;

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className={cardClasses}>
        <LiveChatHeader 
          isListening={isListening}
          isSpeaking={isSpeaking}
          hasApiKey={!!apiKey?.trim()}
        />
        
        <CardContent className="p-8">
          <LiveChatControls
            isListening={isListening}
            onMicToggle={handleMicToggle}
            hasApiKey={!!apiKey?.trim()}
          />
          
          {/* Debug info for development */}
          <div className="mt-4 text-center text-sm opacity-60">
            <p>Status: {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}</p>
            <p>API Key: {apiKey?.trim() ? 'Set ✅' : 'Missing ❌'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
