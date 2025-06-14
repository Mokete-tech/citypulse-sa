
import { useState } from 'react';
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

const LiveChatInterface = ({ darkMode }: LiveChatInterfaceProps) => {
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

  const handleSendText = () => {
    if (textInput.trim() && isConnected) {
      sendText(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative overflow-hidden">
      <LiveChatParticles />

      {/* Main Live Chat Card */}
      <Card className={`relative border-2 shadow-2xl overflow-hidden ${
        darkMode 
          ? 'bg-gray-800/90 border-purple-500/50' 
          : 'bg-white/90 border-purple-200'
      } backdrop-blur-sm`}>
        
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

          {/* Text Input - Only show when connected */}
          {isConnected && (
            <LiveChatTextInput
              textInput={textInput}
              setTextInput={setTextInput}
              onSendText={handleSendText}
              onKeyPress={handleKeyPress}
              darkMode={darkMode}
            />
          )}

          {/* Messages Display */}
          {messages.length > 0 && (
            <LiveChatMessages messages={messages} darkMode={darkMode} />
          )}

          {/* Fun Getting Started Section */}
          {!isConnected && (
            <LiveChatWelcome darkMode={darkMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatInterface;
