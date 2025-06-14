
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIHeader from "@/components/ai/AIHeader";
import AISettingsBar from "@/components/ai/AISettingsBar";
import APIKeySection from "@/components/ai/APIKeySection";
import ChatInterface from "@/components/ai/ChatInterface";
import ConversationHistory from "@/components/ai/ConversationHistory";
import { useAI } from "@/hooks/useAI";

const AIAssistant = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages, apiKey, setApiKey } = useAI();

  const exportConversation = () => {
    const conversation = messages.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pulsepal-conversation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <Navigation />
      
      <AIHeader darkMode={darkMode} />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AISettingsBar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            language={language}
            setLanguage={setLanguage}
            apiKey={apiKey}
            showApiKeyInput={showApiKeyInput}
            setShowApiKeyInput={setShowApiKeyInput}
          />

          <APIKeySection
            darkMode={darkMode}
            showApiKeyInput={showApiKeyInput}
            setShowApiKeyInput={setShowApiKeyInput}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />

          <ChatInterface
            darkMode={darkMode}
            messages={messages}
            isLoading={isLoading}
            apiKey={apiKey}
            sendMessage={sendMessage}
          />

          <ConversationHistory
            darkMode={darkMode}
            messages={messages}
            clearMessages={clearMessages}
            exportConversation={exportConversation}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAssistant;
