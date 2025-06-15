
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load API key on component mount (only if user is authenticated)
  useEffect(() => {
    if (user) {
      loadApiKey();
    } else {
      setIsLoadingApiKey(false);
    }
  }, [user]);

  const loadApiKey = async () => {
    if (!user) return;

    setIsLoadingApiKey(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-key-manager', {
        body: { action: 'retrieve' }
      });

      if (error) throw error;

      if (data?.apiKey) {
        setApiKeyState(data.apiKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  const setApiKey = async (newApiKey: string) => {
    if (user) {
      // If user is authenticated, save securely
      try {
        const { data, error } = await supabase.functions.invoke('api-key-manager', {
          body: { 
            action: 'save',
            apiKey: newApiKey
          }
        });

        if (error) throw error;

        setApiKeyState(newApiKey);
        toast({
          title: "API Key Saved",
          description: "Your Gemini API key has been securely encrypted and saved.",
        });
      } catch (error) {
        console.error('Error saving API key:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save API key. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // If no user, just set in state (temporary storage)
      setApiKeyState(newApiKey);
      toast({
        title: "API Key Set",
        description: "API key set for this session. Sign in to save it permanently.",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to use PulsePal AI.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are PulsePal, an AI assistant for CityPulse that helps users discover deals and events in South Africa. You specialize in:

🛒 Grocery deals (Shoprite, Pick n Pay, Woolworths, Checkers)
🛍️ Retail discounts and shopping specials
🍽️ Restaurant and dining offers
🎉 Local events and activities

Be helpful, friendly, and focus on South African retailers and locations. Provide specific, actionable advice about deals and shopping.

User question: ${content}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Gemini API Error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
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
    apiKey,
    setApiKey,
    isLoadingApiKey,
  };
};
