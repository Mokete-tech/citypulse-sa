
import { useState, useCallback, useMemo, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import LiveChatHeader from './live-chat/LiveChatHeader';
import LiveChatControls from './live-chat/LiveChatControls';
import LiveChatTextInput from './live-chat/LiveChatTextInput';
import LiveChatMessages from './live-chat/LiveChatMessages';
import LiveChatWelcome from './live-chat/LiveChatWelcome';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

const LiveChatInterface = memo(({ darkMode }: LiveChatInterfaceProps) => {
  const [textInput, setTextInput] = useState('');
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
  } = useGeminiLive();

  const handleSendText = useCallback(() => {
    if (textInput.trim() && isConnected) {
      sendText(textInput);
      setTextInput('');
    }
  }, [textInput, isConnected, sendText]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendText();
    }
  }, [handleSendText]);

  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const cardClasses = useMemo(() => 
    `relative border-2 shadow-xl overflow-hidden ${
      darkMode 
        ? 'bg-gray-800/95 border-gray-600' 
        : 'bg-white/95 border-gray-200'
    }`, [darkMode]
  );

  return (
    <div className="relative">
      <Card className={cardClasses}>
        <LiveChatHeader 
          isConnected={isConnected}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
        
        <CardContent className="p-6 space-y-6">
          <LiveChatControls
            isConnected={isConnected}
            isListening={isListening}
            darkMode={darkMode}
            onConnect={connect}
            onDisconnect={disconnect}
            onMicToggle={handleMicToggle}
          />

          {isConnected && (
            <LiveChatTextInput
              textInput={textInput}
              setTextInput={setTextInput}
              onSendText={handleSendText}
              onKeyPress={handleKeyPress}
              darkMode={darkMode}
            />
          )}

          {messages.length > 0 && (
            <LiveChatMessages messages={messages} darkMode={darkMode} />
          )}

          {!isConnected && (
            <LiveChatWelcome darkMode={darkMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
