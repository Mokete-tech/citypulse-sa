
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Send, Download, Moon, Sun, Trash2 } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { formatDistanceToNow } from "date-fns";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [isListening, setIsListening] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useAI();

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality can be implemented here
  };

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navigation />
      
      {/* Header Section */}
      <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-12 border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">CityPulse AI Assistant</h1>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
            <span className="text-2xl font-bold">PulsePal AI</span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ask me anything about local deals, events, or get personalized recommendations
          </p>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Settings Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="afrikaans">Afrikaans</SelectItem>
                  <SelectItem value="zulu">Zulu</SelectItem>
                  <SelectItem value="xhosa">Xhosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className="w-4 h-4" />
                <span className="text-sm">Dark Mode</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <Card className={`mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-6">
              <div className="min-h-[400px] max-h-[500px] overflow-y-auto mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                    <div className="text-6xl mb-4">🤖</div>
                    <p>Hi! I'm PulsePal, your AI assistant. Ask me about deals, events, or anything else!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about deals and events..."
                    className="min-h-[100px] pr-20"
                    maxLength={500}
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {message.length}/500
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Ask PulsePal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleVoiceInput}
                    className={isListening ? "bg-red-100 border-red-300" : ""}
                    disabled={isLoading}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? "text-red-600" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversation History</CardTitle>
                <div className="flex space-x-2">
                  {messages.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={exportConversation}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearMessages}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No conversation history yet. Start chatting with PulsePal!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <Badge variant={msg.role === 'user' ? 'default' : 'secondary'}>
                        {msg.role === 'user' ? 'You' : 'PulsePal'}
                      </Badge>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {msg.content.substring(0, 100)}
                        {msg.content.length > 100 ? '...' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAssistant;
