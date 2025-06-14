
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
      // Enhanced AI response with better retail/grocery understanding
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
      }, 1500);

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

// Enhanced AI response generator with better grocery/retail support
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Grocery and retail specific responses
  if (lowerMessage.includes('shoprite') || lowerMessage.includes('grocery') || lowerMessage.includes('groceries')) {
    return "Great! I can help you find grocery deals at Shoprite and other retailers. Currently, I see several grocery deals available:\n\n• Shoprite has 20% off fresh produce this week\n• Pick n Pay offers buy-2-get-1-free on selected household items\n• Woolworths has premium meat specials\n\nWould you like me to show you specific categories like fresh produce, dairy, or household essentials?";
  }
  
  if (lowerMessage.includes('retail') || lowerMessage.includes('shopping') || lowerMessage.includes('store')) {
    return "Perfect! I can help you discover amazing retail deals across South Africa. Here are some current highlights:\n\n• Clothing & Fashion: Up to 50% off at Woolworths and Truworths\n• Electronics: Incredible Connection has laptop specials\n• Home & Garden: Makro offers furniture discounts\n• Groceries: Multiple supermarket chains have weekly specials\n\nWhat type of retail deals are you most interested in?";
  }
  
  if (lowerMessage.includes('pick n pay') || lowerMessage.includes('picknpay')) {
    return "Pick n Pay has some excellent deals right now! Here's what I found:\n\n• Smart Shopper specials on household essentials\n• Fresh produce at discounted prices\n• Buy-2-get-1-free on selected beverages\n• Baby care products with significant savings\n\nShall I help you find deals in a specific product category?";
  }
  
  if (lowerMessage.includes('woolworths')) {
    return "Woolworths has premium deals available! Current offerings include:\n\n• Fresh food specials on quality ingredients\n• Wine & spirits with member discounts\n• Fashion items with seasonal markdowns\n• Home essentials at reduced prices\n\nAre you looking for food deals or fashion items specifically?";
  }
  
  // General deal and event responses
  if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('special')) {
    return "I can help you find incredible deals! Based on your location and preferences, I recommend checking out our retail deals - especially grocery stores like Shoprite, Pick n Pay, and Woolworths. They're very popular in South Africa and always have fresh specials. Would you like me to show you deals in a specific category or from a particular store?";
  }
  
  if (lowerMessage.includes('event') || lowerMessage.includes('activity')) {
    return "There are many exciting events happening! I can help you discover music concerts, sports events, cultural activities, and shopping events near you. Many retailers also host special promotional events. What type of events are you most interested in?";
  }
  
  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
    return "Great choice! South Africa has amazing dining options. I can recommend restaurants with current deals, or help you find grocery stores with fresh food specials if you prefer cooking at home. Are you looking for restaurants, takeaways, or grocery deals for home cooking?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm PulsePal, your AI assistant for discovering the best deals and events in South Africa. I specialize in helping you find:\n\n🛒 Grocery deals (Shoprite, Pick n Pay, Woolworths)\n🛍️ Retail discounts and shopping specials\n🍽️ Restaurant and dining offers\n🎉 Local events and activities\n\nWhat are you looking for today? Just ask me about any store or type of deal!";
  }
  
  if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('account')) {
    return "To get personalized deals and save your favorites, you can sign in to your account. This will help me:\n\n• Show deals near your location\n• Remember your preferred stores\n• Send notifications about new specials\n• Save your favorite deals for later\n\nWould you like help finding specific deals while you consider creating an account?";
  }
  
  return "I'm here to help you discover amazing deals and events in South Africa! I can assist you with:\n\n🛒 Grocery stores (Shoprite, Pick n Pay, Woolworths)\n🛍️ Retail shopping deals\n🍽️ Restaurants and dining\n🎪 Local events and activities\n\nJust tell me what you're looking for - like 'Shoprite specials' or 'grocery deals near me' - and I'll help you find the best offers!";
};
