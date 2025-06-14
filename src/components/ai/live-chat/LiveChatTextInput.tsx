
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';

interface LiveChatTextInputProps {
  textInput: string;
  setTextInput: (value: string) => void;
  onSendText: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  darkMode: boolean;
}

const LiveChatTextInput = ({ 
  textInput, 
  setTextInput, 
  onSendText, 
  onKeyPress, 
  darkMode 
}: LiveChatTextInputProps) => {
  return (
    <Card className={`border-2 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} backdrop-blur-sm`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
          Or Type a Message
        </h3>
        
        <div className="flex space-x-3">
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message to PulsePal..."
            className={`flex-1 border-2 rounded-xl ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-purple-300 bg-white/50'} focus:border-purple-500 transition-all duration-200 text-base backdrop-blur-sm`}
          />
          <Button
            onClick={onSendText}
            disabled={!textInput.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChatTextInput;
