
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Sparkles, Bot } from "lucide-react";
import { ChatMessage } from "@/hooks/useAI";

interface ConversationHistoryProps {
  darkMode: boolean;
  messages: ChatMessage[];
  clearMessages: () => void;
  exportConversation: () => void;
}

const ConversationHistory = ({
  darkMode,
  messages,
  clearMessages,
  exportConversation
}: ConversationHistoryProps) => {
  return (
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
  );
};

export default ConversationHistory;
