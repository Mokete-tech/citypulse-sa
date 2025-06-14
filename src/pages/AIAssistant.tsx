
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Send, Download, Moon, Sun, Trash2, Key, ExternalLink, Sparkles, Bot, User } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { formatDistanceToNow } from "date-fns";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [isListening, setIsListening] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages, apiKey, setApiKey } = useAI();

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
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <Navigation />
      
      {/* Hero Header Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-indigo-900/80' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'} py-16 border-b backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 animate-pulse"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl mb-8 shadow-2xl">
            <div className="relative">
              <Bot className="w-8 h-8 text-yellow-300" />
              <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">PulsePal AI</span>
              <p className="text-sm text-blue-100 opacity-90">Powered by Gemini</p>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Your Smart City Assistant
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Discover the best deals, events, and local recommendations across South Africa with AI-powered insights
          </p>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Settings Bar */}
          <div className={`flex flex-wrap items-center justify-between mb-8 gap-4 p-4 rounded-2xl backdrop-blur-sm border ${darkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-white/60 border-white/80'} shadow-lg`}>
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className={`w-32 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white/80'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="afrikaans">Afrikaans</SelectItem>
                  <SelectItem value="zulu">Zulu</SelectItem>
                  <SelectItem value="xhosa">Xhosa</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className={`transition-all duration-200 ${apiKey ? "border-green-500 text-green-600 bg-green-50 hover:bg-green-100" : "hover:scale-105"}`}
              >
                <Key className="w-4 h-4 mr-2" />
                {apiKey ? "API Key Set" : "Set API Key"}
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <Card className={`mb-6 border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-purple-500' : 'bg-white/90 border-purple-200'} backdrop-blur-sm`}>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Gemini API Key Configuration
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                    className="text-white hover:bg-white/20"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get API Key
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your Gemini API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Your API key is stored locally and never sent to our servers. 
                    Get a free Gemini API key from Google AI Studio.
                  </p>
                </div>
                <Button
                  onClick={() => setShowApiKeyInput(false)}
                  disabled={!apiKey.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Save API Key
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Chat Area */}
          <Card className={`mb-6 border-2 shadow-2xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className={`min-h-[400px] max-h-[500px] overflow-y-auto mb-6 p-6 rounded-2xl border-2 ${darkMode ? 'border-gray-600 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
                {messages.length === 0 ? (
                  <div className="text-center mt-20">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                        <Bot className="w-12 h-12 text-white" />
                      </div>
                      <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/2 transform translate-x-8 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Hi! I'm PulsePal 👋
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Your AI assistant powered by Gemini, ready to help you discover amazing deals and events!
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Ask me about South African deals, events, groceries, and more!
                    </p>
                    {!apiKey && (
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          ⚠️ Please set your Gemini API key to start chatting
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : `${darkMode ? 'bg-gray-700' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} text-gray-900 dark:text-gray-100`
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.role === 'user' 
                                ? 'bg-white/20' 
                                : 'bg-gradient-to-r from-purple-500 to-blue-500'
                            }`}>
                              {msg.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              <span className="text-xs opacity-70 mt-2 block">
                                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className={`max-w-[80%] rounded-2xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-lg`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
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
                    className={`min-h-[100px] pr-20 border-2 rounded-xl ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} focus:border-purple-500 transition-all duration-200`}
                    maxLength={500}
                    disabled={isLoading || !apiKey}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {message.length}/500
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading || !apiKey}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Ask PulsePal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleVoiceInput}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isListening 
                        ? "bg-red-100 border-red-300 text-red-600 hover:bg-red-200" 
                        : "border-gray-300 hover:border-purple-400"
                    }`}
                    disabled={isLoading || !apiKey}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? "text-red-600 animate-pulse" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card className={`border-2 shadow-xl ${darkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
            <CardHeader className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  Conversation History
                </CardTitle>
                <div className="flex space-x-2">
                  {messages.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={exportConversation}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearMessages}
                        className="hover:scale-105 transition-transform duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No conversation history yet. Start chatting with PulsePal!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <Badge variant={msg.role === 'user' ? 'default' : 'secondary'} className="mb-2">
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
