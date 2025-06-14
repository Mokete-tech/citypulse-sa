
import { useState, useCallback, useMemo, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import LiveChatParticles from './live-chat/LiveChatParticles';
import LiveChatHeader from './live-chat/LiveChatHeader';
import LiveChatControls from './live-chat/LiveChatControls';
import LiveChatTextInput from './live-chat/LiveChatTextInput';
import LiveChatMessages from './live-chat/LiveChatMessages';
import LiveChatWelcome from './live-chat/LiveChatWelcome';

interface LiveChatInterfaceProps {
  darkMode: boolean;
}

// Memoize the main component to prevent unnecessary re-renders
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

  // Memoize all handlers to prevent recreation
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

  // Memoize card classes
  const cardClasses = useMemo(() => 
    `relative border-2 shadow-2xl overflow-hidden ${
      darkMode 
        ? 'bg-gray-800/90 border-purple-500/50' 
        : 'bg-white/90 border-purple-200'
    } backdrop-blur-sm`, [darkMode]
  );

  // Memoize components that depend on state to prevent unnecessary re-renders
  const memoizedHeader = useMemo(() => (
    <LiveChatHeader 
      isConnected={isConnected}
      isListening={isListening}
      isSpeaking={isSpeaking}
    />
  ), [isConnected, isListening, isSpeaking]);

  const memoizedControls = useMemo(() => (
    <LiveChatControls
      isConnected={isConnected}
      isListening={isListening}
      darkMode={darkMode}
      onConnect={connect}
      onDisconnect={disconnect}
      onMicToggle={handleMicToggle}
    />
  ), [isConnected, isListening, darkMode, connect, disconnect, handleMicToggle]);

  const memoizedTextInput = useMemo(() => {
    if (!isConnected) return null;
    return (
      <LiveChatTextInput
        textInput={textInput}
        setTextInput={setTextInput}
        onSendText={handleSendText}
        onKeyPress={handleKeyPress}
        darkMode={darkMode}
      />
    );
  }, [isConnected, textInput, handleSendText, handleKeyPress, darkMode]);

  const memoizedMessages = useMemo(() => {
    if (messages.length === 0) return null;
    return <LiveChatMessages messages={messages} darkMode={darkMode} />;
  }, [messages, darkMode]);

  const memoizedWelcome = useMemo(() => {
    if (isConnected) return null;
    return <LiveChatWelcome darkMode={darkMode} />;
  }, [isConnected, darkMode]);

  return (
    <div className="relative overflow-hidden">
      <LiveChatParticles />
      
      <Card className={cardClasses}>
        {memoizedHeader}
        
        <CardContent className="p-6 space-y-6">
          {memoizedControls}
          {memoizedTextInput}
          {memoizedMessages}
          {memoizedWelcome}
        </CardContent>
      </Card>
    </div>
  );
});

LiveChatInterface.displayName = 'LiveChatInterface';

export default LiveChatInterface;
