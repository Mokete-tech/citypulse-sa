
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate AI response for now - you can integrate with OpenAI or other AI services later
      const aiResponse = generateAIResponse(content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};

// Simple AI response generator - replace with actual AI service
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('deal') || lowerMessage.includes('discount')) {
    return "I can help you find great deals! Based on your location and preferences, I recommend checking out our Food & Drink deals - they're very popular in South Africa. Would you like me to show you deals in a specific category?";
  }
  
  if (lowerMessage.includes('event') || lowerMessage.includes('activity')) {
    return "There are many exciting events happening! I can help you discover music concerts, sports events, and cultural activities near you. What type of events are you most interested in?";
  }
  
  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
    return "Great choice! South Africa has amazing dining options. I can recommend restaurants with current deals, or help you find events featuring local cuisine. Are you looking for a specific type of food or area?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm PulsePal, your AI assistant for discovering the best deals and events in South Africa. I can help you find restaurants, entertainment, shopping deals, and exciting local events. What are you looking for today?";
  }
  
  return "I'm here to help you discover amazing deals and events in South Africa! I can assist you with finding restaurants, entertainment, shopping deals, and local activities. Feel free to ask me about specific categories or locations you're interested in.";
};
