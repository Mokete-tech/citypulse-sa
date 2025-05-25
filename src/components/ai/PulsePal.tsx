import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Coins, MapPin, Search, Brain, Sparkles, Calculator, List, Wand2, PartyPopper, Star, Zap, Sparkles as SparklesIcon, Mic, MicOff, Moon, Sun, History, Globe, Download, Filter, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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

interface Conversation {
  id: string;
  question: string;
  response: string;
  timestamp: string;
  language: string;
}

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa' },
  { code: 'st', name: 'Sesotho' },
  { code: 'tn', name: 'Setswana' },
  { code: 've', name: 'Tshivenda' },
  { code: 'ts', name: 'Xitsonga' },
  { code: 'ss', name: 'siSwati' },
  { code: 'nr', name: 'isiNdebele' }
];

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

// Add voice recognition languages
const VOICE_RECOGNITION_LANGUAGES = {
  'en': 'en-US',
  'af': 'af-ZA',
  'zu': 'zu-ZA',
  'xh': 'xh-ZA',
  'st': 'st-ZA',
  'tn': 'tn-ZA'
};

// Add voice commands
const VOICE_COMMANDS = {
  'en': {
    'search': ['search for', 'find', 'look for'],
    'filter': ['filter by', 'show only', 'display'],
    'export': ['export', 'download', 'save'],
    'clear': ['clear', 'reset', 'start over'],
    'help': ['help', 'what can you do', 'show commands']
  },
  'af': {
    'search': ['soek vir', 'vind', 'kyk vir'],
    'filter': ['filter deur', 'wys net', 'vertoon'],
    'export': ['eksporteer', 'laai af', 'stoor'],
    'clear': ['maak skoon', 'herstel', 'begin oor'],
    'help': ['help', 'wat kan jy doen', 'wys opdragte']
  }
  // Add more languages as needed
};

// Add voice feedback messages for all languages
const VOICE_FEEDBACK = {
  listening: {
    'en': 'Listening...',
    'af': 'Luister...',
    'zu': 'Lalela...',
    'xh': 'Phulaphula...',
    'st': 'Mamela...',
    'tn': 'Reetsa...',
    've': 'Thetshelesa...',
    'ts': 'Tinghisa...',
    'ss': 'Lalela...',
    'nr': 'Lalela...'
  },
  speak: {
    'en': 'Speak now',
    'af': 'Praat nou',
    'zu': 'Khuluma manje',
    'xh': 'Thetha ngoku',
    'st': 'Bua hona joale',
    'tn': 'Bua jaanong',
    've': 'Amba zwino',
    'ts': 'Vulavula sweswi',
    'ss': 'Khuluma manje',
    'nr': 'Khuluma manje'
  },
  commands: {
    'en': 'Available commands: search, filter, export, clear, help',
    'af': 'Beskikbare opdragte: soek, filter, eksporteer, maak skoon, help',
    'zu': 'Imiyalo etholakalayo: sesha, hlunga, thumela, susa, siza',
    'xh': 'Iimvume ezifumanekayo: khangela, hlalutya, thumela, susa, nceda',
    'st': 'Litaelo tse fumanehang: batla, hlophisa, romela, hlakola, thusa',
    'tn': 'Ditaelo tse di gona: batla, hlophisa, romela, tlosa, thusa',
    've': 'Mihumbulo ya u wanala: ṱoḓa, ṱuṱuwedza, rumela, tshinyaludza, thusa',
    'ts': 'Miyelano leyi kumekaka: lava, hlaya, rhumela, susa, pfuna',
    'ss': 'Temiso leti khona: sesha, hlola, thumela, susa, sita',
    'nr': 'Imiyalo etholakalayo: sesha, hlola, thumela, susa, siza'
  }
};

// Add these constants at the top with other constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const API_TIMEOUT = 30000; // 30 seconds

// Add these constants at the top
const OFFLINE_MESSAGE = 'You are currently offline. Some features may be limited.';
const NETWORK_RECOVERY_MESSAGE = 'You are back online!';

// Add these constants at the top
const MAX_QUESTION_LENGTH = 500;
const MIN_QUESTION_LENGTH = 2;

// Add input validation function
const validateInput = (input: string): { isValid: boolean; error?: string } => {
  if (!input.trim()) {
    return { isValid: false, error: 'Question cannot be empty' };
  }
  
  if (input.length < MIN_QUESTION_LENGTH) {
    return { isValid: false, error: `Question must be at least ${MIN_QUESTION_LENGTH} characters long` };
  }
  
  if (input.length > MAX_QUESTION_LENGTH) {
    return { isValid: false, error: `Question cannot exceed ${MAX_QUESTION_LENGTH} characters` };
  }
  
  return { isValid: true };
};

// Error Boundary Component
class PulsePalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('PulsePal error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Move these to the top level to avoid circular dependencies
const createExportFunction = (conversations: Conversation[], language: string) => {
  return () => {
    try {
      const data = conversations.map(conv => ({
        question: conv.question,
        response: conv.response,
        language: SUPPORTED_LANGUAGES.find(l => l.code === conv.language)?.name || conv.language,
        timestamp: new Date(conv.timestamp).toLocaleString()
      }));

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulsepal-conversations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Conversations exported successfully');
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast.error('Failed to export conversations', {
        description: 'Please try again later'
      });
      throw error; // Re-throw to be caught by the caller
    }
  };
};

// Add timeout promise
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timeout')), ms)
);

// Add loading state types
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Add type for API response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Add animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
};

// Add loading state component
const LoadingIndicator = () => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={fadeIn}
    className="flex items-center gap-2 text-purple-600"
  >
    <Loader2 className="h-5 w-5 animate-spin" />
    <span className="text-sm font-medium">{LOADING_MESSAGES[0]}</span>
  </motion.div>
);

// Add error state component
const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={fadeIn}
    className="bg-red-50 border border-red-200 rounded-md p-3"
  >
    <div className="flex items-center gap-2">
      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-red-800">{message}</p>
    </div>
  </motion.div>
);

// Add success state component
const SuccessMessage = () => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={scaleIn}
    className="bg-green-50 border border-green-200 rounded-md p-3"
  >
    <div className="flex items-center gap-2">
      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-green-800">Response generated successfully!</p>
    </div>
  </motion.div>
);

export function PulsePal({ apiKey }: { apiKey: string }) {
  // State declarations
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  // Validate API key
  useEffect(() => {
    if (!apiKey) {
      setError('API key is required');
      toast.error('Configuration Error', {
        description: 'Please provide a valid API key'
      });
      return;
    }
    setIsApiKeyValid(true);
  }, [apiKey]);

  // Memoized values
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = searchQuery === '' || 
        conv.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.response.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = filterDate === '' || 
        new Date(conv.timestamp).toLocaleDateString() === new Date(filterDate).toLocaleDateString();
      
      return matchesSearch && matchesDate;
    });
  }, [conversations, searchQuery, filterDate]);

  // Create export function
  const exportConversations = useCallback(() => {
    setIsExporting(true);
    try {
      createExportFunction(filteredConversations, selectedLanguage)();
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast.error('Failed to export conversations', {
        description: 'Please try again later'
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredConversations, selectedLanguage]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((transcript: string) => {
    try {
      const commands = VOICE_COMMANDS[selectedLanguage as keyof typeof VOICE_COMMANDS] || VOICE_COMMANDS.en;
      
      if (commands.search.some(cmd => transcript.toLowerCase().includes(cmd))) {
        const searchTerm = transcript.split(commands.search[0])[1]?.trim();
        if (searchTerm) {
          setSearchQuery(searchTerm);
          toast.info('Searching...', { description: `Looking for "${searchTerm}"` });
        }
      } else if (commands.filter.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setShowFilters(true);
        toast.info('Filters opened', { description: 'Please select your filter criteria' });
      } else if (commands.export.some(cmd => transcript.toLowerCase().includes(cmd))) {
        exportConversations();
      } else if (commands.clear.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setSearchQuery('');
        setFilterDate('');
        toast.success('Filters cleared');
      } else if (commands.help.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setShowCommands(true);
        toast.info('Voice Commands', { 
          description: VOICE_FEEDBACK.commands[selectedLanguage as keyof typeof VOICE_FEEDBACK.commands] || VOICE_FEEDBACK.commands.en
        });
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command', {
        description: 'Please try again'
      });
    }
  }, [selectedLanguage, exportConversations]);

  // Add cleanup for voice recognition
  useEffect(() => {
    let recognitionInstance: any = null;
    let mounted = true;
    let cleanupTimeout: NodeJS.Timeout;
    
    const cleanup = () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
          recognitionInstance = null;
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }
    };

    if ('webkitSpeechRecognition' in window) {
      try {
        recognitionInstance = new (window as any).webkitSpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = VOICE_RECOGNITION_LANGUAGES[selectedLanguage as keyof typeof VOICE_RECOGNITION_LANGUAGES] || 'en-US';

        recognitionInstance.onstart = () => {
          if (mounted) {
            setIsVoiceActive(true);
            setVoiceFeedback(VOICE_FEEDBACK.listening[selectedLanguage as keyof typeof VOICE_FEEDBACK.listening] || 'Listening...');
          }
        };

        recognitionInstance.onresult = (event: any) => {
          try {
            const transcript = event.results[0][0].transcript;
            if (mounted) {
              if (transcript.toLowerCase().startsWith('command')) {
                handleVoiceCommand(transcript);
              } else {
                setQuestion(transcript);
              }
            }
          } catch (error) {
            console.error('Error processing voice input:', error);
            if (mounted) {
              toast.error('Failed to process voice input', {
                description: 'Please try again'
              });
            }
          } finally {
            if (mounted) {
              setIsVoiceActive(false);
              setVoiceFeedback('');
            }
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (mounted) {
            setIsVoiceActive(false);
            setVoiceFeedback('');
            toast.error('Voice input failed', {
              description: 'Could not recognize speech. Please try typing instead.'
            });
          }
        };

        recognitionInstance.onend = () => {
          if (mounted) {
            setIsVoiceActive(false);
            setVoiceFeedback('');
          }
        };

        setRecognition(recognitionInstance);
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        if (mounted) {
          toast.error('Voice input not available', {
            description: 'Speech recognition is not supported in your browser.'
          });
        }
      }
    }

    return () => {
      mounted = false;
      cleanup();
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
    };
  }, [selectedLanguage, handleVoiceCommand]);

  // Add network status handling
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success(NETWORK_RECOVERY_MESSAGE);
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error(OFFLINE_MESSAGE);
    };

    // Set initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Modify handleApiCall to use loading state
  const handleApiCall = async () => {
    // Validate input first
    const validation = validateInput(question);
    if (!validation.isValid) {
      setLoadingState('error');
      toast.error('Invalid Input', {
        description: validation.error
      });
      return;
    }

    if (isOffline) {
      setLoadingState('error');
      toast.error('Cannot make API calls while offline', {
        description: 'Please check your internet connection'
      });
      return;
    }

    if (!isApiKeyValid) {
      setLoadingState('error');
      toast.error('Invalid API Key', {
        description: 'Please check your configuration'
      });
      return;
    }

    try {
      setLoadingState('loading');
      setLoading(true);
      setError(null);
      
      // First, get available models with timeout
      const modelsResponse = await Promise.race([
        fetch(`${GEMINI_LIST_MODELS_URL}?key=${apiKey}`),
        timeout(API_TIMEOUT)
      ]) as Response;
      
      if (!modelsResponse.ok) {
        throw new Error('Failed to fetch available models');
      }
      
      const modelsData = await modelsResponse.json() as { models: Array<{ name: string }> };
      const availableModels = modelsData.models
        .filter(model => model.name.startsWith('models/gemini'))
        .map(model => model.name);
      
      setAvailableModels(availableModels);
      
      if (availableModels.length === 0) {
        throw new Error('No Gemini models available');
      }
      
      // Select the first available model
      const model = availableModels[0];
      setSelectedModel(model);
      GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent`;
      
      // Make the actual API call with timeout
      const response = await Promise.race([
        fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: question
              }]
            }]
          })
        }),
        timeout(API_TIMEOUT)
      ]) as Response;

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json() as GeminiResponse;
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Save conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        question,
        response: generatedText,
        timestamp: new Date().toISOString(),
        language: selectedLanguage
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setResponse(generatedText);
      setShowConfetti(true);
      setLoadingState('success');
      setRetryCount(0); // Reset retry count on success
      
      // Reset loading message
      setLoadingMessage(LOADING_MESSAGES[0]);
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoadingState('error');
      
      // Implement retry logic with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const nextRetry = retryCount + 1;
        setRetryCount(nextRetry);
        const backoffDelay = RETRY_DELAY * Math.pow(2, nextRetry - 1);
        
        toast.error('Request failed', {
          description: `Retrying in ${backoffDelay/1000} seconds... (${nextRetry}/${MAX_RETRIES})`
        });
        
        setTimeout(handleApiCall, backoffDelay);
      } else {
        toast.error('Request failed', {
          description: 'Maximum retry attempts reached. Please try again later.'
        });
        setRetryCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add cleanup for confetti
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Add loading message rotation
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Add input validation to the question input
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_QUESTION_LENGTH) {
      setQuestion(newValue);
    }
  };

  return (
    <PulsePalErrorBoundary>
      <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
        {/* Offline Indicator */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-yellow-50 border border-yellow-200 rounded-md p-3"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-800">{OFFLINE_MESSAGE}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Globe className="h-5 w-5 text-gray-500" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Question Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <textarea
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask me anything about deals and events..."
            className={`w-full p-4 rounded-lg border ${
              question.length > MAX_QUESTION_LENGTH * 0.9
                ? 'border-yellow-300 focus:border-yellow-400'
                : 'border-gray-300 focus:border-purple-400'
            } focus:ring-2 focus:ring-purple-200 transition-colors`}
            rows={4}
            disabled={loadingState === 'loading'}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {question.length}/{MAX_QUESTION_LENGTH}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApiCall}
            disabled={loadingState === 'loading' || !question.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              loadingState === 'loading'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {loadingState === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Ask PulsePal</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isVoiceActive
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isVoiceActive ? (
              <>
                <MicOff className="h-5 w-5" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Start Voice</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {loadingState === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 text-purple-600"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">{loadingMessage}</span>
            </motion.div>
          )}
          {loadingState === 'error' && error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-md p-3"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </motion.div>
          )}
          {loadingState === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-md p-3"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">Response generated successfully!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Display */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="prose max-w-none">
                {response}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 pt-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Conversation History</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportConversations}
              disabled={isExporting || !isApiKeyValid}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="space-y-4">
            {filteredConversations.map(conv => (
              <motion.div
                key={conv.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{conv.question}</p>
                    <p className="mt-2 text-gray-600">{conv.response}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>{new Date(conv.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>{SUPPORTED_LANGUAGES.find(l => l.code === conv.language)?.name || conv.language}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PulsePalErrorBoundary>
  );
}
