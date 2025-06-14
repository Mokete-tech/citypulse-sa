import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIHeader from "@/components/ai/AIHeader";
import AISettingsBar from "@/components/ai/AISettingsBar";
import APIKeySection from "@/components/ai/APIKeySection";
import ChatInterface from "@/components/ai/ChatInterface";
import ConversationHistory from "@/components/ai/ConversationHistory";
import { useAI } from "@/hooks/useAI";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import LiveChatInterface from "@/components/ai/LiveChatInterface";

const AIAssistant = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'normal' | 'live'>('normal');
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Chat Mode Selector */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
              <button
                onClick={() => setChatMode('normal')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  chatMode === 'normal'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                💬 Regular Chat
              </button>
              <button
                onClick={() => setChatMode('live')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  chatMode === 'live'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                🎤 Live Chat
              </button>
            </div>
          </div>

          {chatMode === 'normal' ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <AISettingsBar
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  language={language}
                  setLanguage={setLanguage}
                  apiKey={apiKey}
                  showApiKeyInput={showApiKeyInput}
                  setShowApiKeyInput={setShowApiKeyInput}
                />
                
                <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`${darkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-white/60 border-gray-300'} backdrop-blur-sm hover:scale-105 transition-transform`}
                    >
                      <History className="w-4 h-4 mr-2" />
                      History ({messages.length})
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className={`w-96 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm`}>
                    <ConversationHistory
                      darkMode={darkMode}
                      messages={messages}
                      clearMessages={clearMessages}
                      exportConversation={exportConversation}
                    />
                  </SheetContent>
                </Sheet>
              </div>

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
            </>
          ) : (
            <LiveChatInterface 
              darkMode={darkMode} 
              sendMessage={sendMessage}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAssistant;
