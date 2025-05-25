import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Coins, MapPin, Search, Brain, Sparkles, Calculator, List, Wand2, PartyPopper, Star, Zap, Sparkles as SparklesIcon, Mic, MicOff, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Deal {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount?: number;
  location?: string;
  city?: string;
  date?: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  price: number;
  location?: string;
  city?: string;
  date?: string;
  latitude?: string;
  longitude?: string;
}

// Updated to use the list models endpoint first, then we'll use an available model
const GEMINI_LIST_MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models";
// We'll set the content generation URL after we get the available models
let GEMINI_API_URL = "";

// Cool loading messages
const LOADING_MESSAGES = [
  "✨ Scanning the city for the best deals...",
  "🎯 Finding perfect matches for you...",
  "🌟 Discovering hidden gems...",
  "🎨 Painting a picture of possibilities...",
  "🚀 Launching into the best recommendations...",
  "🎪 Exploring the city's entertainment...",
  "🎭 Curating your perfect weekend...",
  "🎪 Finding the coolest spots...",
  "🎯 Zeroing in on the best deals...",
  "✨ Adding a touch of magic..."
];

export function PulsePal({ apiKey }: { apiKey: string }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Rotate through loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading, LOADING_MESSAGES]);

  // Validate API key on mount
  useEffect(() => {
    if (apiKey) {
      // Simple validation - check if key is in correct format
      setIsApiKeyValid(/^[A-Za-z0-9-_]{39}$/.test(apiKey));
    } else {
      setIsApiKeyValid(false);
    }
  }, [apiKey]);

  // Load deals from Supabase and get available models
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch deals with proper error handling
        const { data: dealsData, error: dealsError } = await supabase
          .from("deals")
          .select("*")
          .order('created_at', { ascending: false });

        if (dealsError) {
          console.error("Error fetching deals:", dealsError);
          toast.error("Failed to load deals", {
            description: "Please try again later"
          });
          setDeals([]);
        } else {
        setDeals(dealsData || []);
        }
        
        // Fetch events with proper error handling
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order('created_at', { ascending: false });

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Failed to load events", {
            description: "Please try again later"
          });
          setEvents([]);
        } else {
        setEvents(eventsData || []);
        }
        
        // Try to get available models if we have an API key
        if (apiKey && isApiKeyValid) {
          try {
            const modelsRes = await fetch(`${GEMINI_LIST_MODELS_URL}?key=${apiKey}`);
            if (!modelsRes.ok) {
              throw new Error(`Failed to fetch models: ${modelsRes.status}`);
            }
            
              const modelsData = await modelsRes.json();
              console.log("Available models:", modelsData);
              
              // Filter models that support generateContent
              const supportedModels = modelsData.models?.filter((model: any) => 
                model.supportedGenerationMethods?.includes("generateContent")
              ) || [];
              
              const modelIds = supportedModels.map((model: any) => model.name);
              setAvailableModels(modelIds);
              
              // Select gemini-1.0-pro if available, otherwise use the first supported model
              const preferredModel = modelIds.find((id: string) => id.includes("gemini-pro")) || modelIds[0];
              if (preferredModel) {
                setSelectedModel(preferredModel);
                // Extract the model name from the full path (e.g., "models/gemini-pro")
                const modelName = preferredModel.split("/").pop();
                GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
                console.log("Selected model:", preferredModel);
                console.log("Content generation URL:", GEMINI_API_URL);
            } else {
              throw new Error("No supported Gemini model found");
            }
          } catch (err) {
            console.error("Error fetching available models:", err);
            toast.error("Failed to load AI models", {
              description: "Some features may be limited"
            });
          }
        }
      } catch (err: any) {
        console.error("Error in data fetching:", err);
        toast.error("Failed to load data", {
          description: "Could not load deals and events. Please try again later."
        });
      }
    };
    
    fetchData();
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.log("Location access denied:", err);
          toast.info("Location access denied", {
            description: "Some features may be limited without location access."
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000
        }
      );
    }
  }, [apiKey, isApiKeyValid]);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Enhanced prompt with personality
  const makePrompt = (q: string) => {
    // Get deals with their distances if location is available
    let dealsWithContext = deals;
    if (userLocation && deals.some(d => d.latitude && d.longitude)) {
      dealsWithContext = deals
        .filter(d => d.latitude && d.longitude)
        .map(d => ({
          ...d,
          distance: calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            parseFloat(d.latitude), 
            parseFloat(d.longitude)
          )
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    // Format deals for the prompt
    const dealsText = dealsWithContext.length
      ? dealsWithContext
          .map(
            (d, i) => {
              const locationStr = d.location || d.city || "Unknown location";
              const distanceStr = d.distance ? ` (${d.distance.toFixed(1)}km away)` : '';
              return `${i + 1}. ${d.title} at ${locationStr}${distanceStr}${d.date ? " on " + d.date : ""} for R${d.price || d.discount || "Unknown price"}`;
            }
          )
          .join("\n")
      : "No deals available right now.";

    // Format events for the prompt
    const eventsText = events.length
      ? events
          .map(
            (e, i) => {
              const locationStr = e.location || e.city || "Unknown location";
              return `${i + 1}. ${e.title} at ${locationStr} on ${e.date || "Unknown date"} for R${e.price || "Free"}`;
            }
          )
          .join("\n")
      : "No events available right now.";

    return `
You are PulsePal, a vibrant and enthusiastic AI assistant for CityPulse users in South Africa. You have a cool, friendly personality and love helping people discover amazing local experiences.

Your communication style:
- Use emojis naturally to express excitement 🎉
- Be enthusiastic but not overwhelming
- Use casual, friendly language
- Add personality to your responses
- Include fun facts about locations when relevant
- Suggest creative combinations of deals and events
- Use South African slang occasionally (like "lekker" for cool)

You have access to the following list of event deals:
${dealsText}

And these events:
${eventsText}

User location context: ${userLocation ? `The user is currently located at coordinates ${userLocation.lat}, ${userLocation.lng}.` : "User location is unknown."}

User request: "${q}"

Guidelines:
- If the user asks about their budget, recommend deals and events within that budget
- If the user mentions a location or distance, prioritize nearby deals and events
- If the user asks for a summary, summarize the deals in an engaging way
- If the user wants recommendations, pick events that sound fun, unique, or affordable
- Always be friendly, concise and practical
- Use South African Rands (R) for all prices
- Format your response in a clear, easy to read way
- Add relevant emojis to make the response more engaging
- Include a fun fact or tip at the end of your response when appropriate
    `.trim();
  };

  // Enhanced ask function with animations
  const askPulsePal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setShowConfetti(false);

    if (!isApiKeyValid) {
      setError("Invalid or missing Gemini API key.");
      toast.error("API key error", {
        description: "Please provide a valid Gemini API key in the environment variables."
      });
      setLoading(false);
      return;
    }

    try {
      const prompt = makePrompt(question);
      
      if (!GEMINI_API_URL) {
        setError("No supported Gemini model found.");
        toast.error("Model selection failed", {
          description: "Could not find a suitable Gemini model for content generation."
        });
        setLoading(false);
        return;
      }

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9, // Increased for more creative responses
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResponse(data.candidates[0].content.parts[0].text);
        setShowConfetti(true);
        // Log the successful interaction
        try {
          await supabase.from("analytics").insert({
            event_type: 'ai_interaction',
            event_source: 'pulsepal',
            source_id: 0,
            metadata: { 
              query: question, 
              success: true,
              response_length: data.candidates[0].content.parts[0].text.length
            }
          });
        } catch (err) {
          console.error("Failed to log AI interaction:", err);
        }
      } else {
        setError("No AI response.");
        toast.error("No response received", {
          description: "Gemini didn't provide a response."
        });
      }
    } catch (err: any) {
      console.error("Gemini API request failed:", err);
      setError(err.message || "Unknown error");
      toast.error("Request failed", {
        description: err.message || "An unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick action buttons
  const quickAsk = (q: string) => {
    setQuestion(q);
    setTimeout(() => {
      const form = document.getElementById("pulsepal-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  // Initialize speech recognition
  useEffect(() => {
    let recognitionInstance: any = null;
    
    if ('webkitSpeechRecognition' in window) {
      try {
        recognitionInstance = new (window as any).webkitSpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

        recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice input failed', {
          description: 'Could not recognize speech. Please try typing instead.'
        });
      };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        toast.error('Voice input not available', {
          description: 'Speech recognition is not supported in your browser.'
        });
      }
    } else {
      toast.info('Voice input not available', {
        description: 'Speech recognition is not supported in your browser.'
      });
    }

    // Cleanup function
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }
    };
  }, []);

  // Handle speech recognition toggle
  const toggleSpeechRecognition = () => {
    if (!recognition) {
      toast.error('Voice input not available', {
        description: 'Speech recognition is not supported in your browser.'
      });
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    } catch (err) {
      console.error('Error toggling speech recognition:', err);
      toast.error('Voice input failed', {
        description: 'Could not start speech recognition. Please try typing instead.'
      });
      setIsListening(false);
    }
  };

  // Toggle dark mode with persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Optimize confetti animation
  const Confetti = React.memo(() => {
    const confettiCount = 30; // Reduced from 50 for better performance
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 pointer-events-none"
      >
        {[...Array(confettiCount)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -20,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: window.innerHeight + 20,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: Math.random() * 2 + 2,
              repeat: 0,
              ease: "linear"
            }}
            className="absolute"
          >
            {['🎉', '✨', '🎊', '🌟', '🎈'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </motion.div>
    );
  });

  return (
    <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-lg font-medium text-purple-600 dark:text-purple-400"
        >
          <SparklesIcon className="h-5 w-5" />
          <span>PulsePal AI Assistant</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>
      </div>
      
      {!apiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700 text-sm mb-3">
          <strong>Missing API key:</strong> Add VITE_GEMINI_API_KEY to your .env file to enable AI features.
        </div>
      )}

      {apiKey && !selectedModel && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-700 text-sm mb-3">
          <strong>Finding available models...</strong> Please wait while we connect to the Gemini API.
        </div>
      )}

      {availableModels.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm mb-3 flex items-center gap-2">
          <List className="h-4 w-4" />
          <span>Using model: <strong>{selectedModel.split('/').pop()}</strong></span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => quickAsk("What deals are available under R100?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
          disabled={!selectedModel || loading}
        >
          <Coins className="h-4 w-4" />
          <span>Budget Deals</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => quickAsk("What events are happening near me this weekend?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
          disabled={!selectedModel || loading}
        >
          <MapPin className="h-4 w-4" />
          <span>Nearby Events</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => quickAsk("I have R200 for entertainment this weekend, what do you recommend?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
          disabled={!selectedModel || loading}
        >
          <Calculator className="h-4 w-4" />
          <span>Plan My Weekend</span>
        </motion.button>
      </div>

      <form onSubmit={askPulsePal} className="space-y-4">
        <div className="relative">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Ask about deals, events, budgets, locations..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 dark:bg-gray-800 dark:text-white"
            required
            disabled={!selectedModel || loading}
          />
          <Brain className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
          {recognition && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={toggleSpeechRecognition}
              className="absolute right-3 top-2.5 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={!selectedModel || loading}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4 text-purple-500" />
              )}
            </motion.button>
          )}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          disabled={loading || !apiKey || !selectedModel}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>{loadingMessage}</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Ask PulsePal</span>
            </>
          )}
        </motion.button>
      </form>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
        
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm overflow-auto max-h-[400px]"
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {response.split('\n').map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && <Confetti />}
    </div>
  );
}
