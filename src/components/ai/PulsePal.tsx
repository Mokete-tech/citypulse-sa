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

// Add Web Speech API type definitions
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
  prototype: SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// For speech recognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
type SpeechRecognitionType = SpeechRecognitionConstructor;

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

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// Add proper type definitions for API responses
interface GeminiModel {
  name: string;
  displayName: string;
  description: string;
  supportedGenerationMethods: string[];
}

interface GeminiModelsResponse {
  models: GeminiModel[];
}

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiContentPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  safetyRatings?: Array<{
    category: string;
    probability: string;
  }>;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

// Add proper type definitions for state
interface PulsePalState {
  // Core state
  deals: Deal[];
  events: Event[];
  question: string;
  response: string | null;
  loading: boolean;
  error: string | null;
  userLocation: { lat: number; lng: number } | null;
  
  // API state
  isApiKeyValid: boolean;
  availableModels: string[];
  selectedModel: string;
  loadingMessage: string;
  loadingState: LoadingState;
  retryCount: number;
  
  // UI state
  showConfetti: boolean;
  isDarkMode: boolean;
  showFilters: boolean;
  showCommands: boolean;
  isHistoryOpen: boolean;
  
  // Voice recognition state
  recognition: SpeechRecognitionInstance | null;
  isVoiceActive: boolean;
  voiceFeedback: string;
  voiceRecognition: {
    isActive: boolean;
    feedback: string;
    language: string;
    commands: Record<string, string[]>;
  };
  
  // Conversation state
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  conversationSearch: string;
  conversationFilter: string;
  isExporting: boolean;
  
  // Language and localization
  selectedLanguage: string;
  
  // Network state
  isOffline: boolean;
  
  // Search and filter state
  searchQuery: string;
  filterDate: string;
  
  // Selection state
  selectedDeal: Deal | null;
  selectedEvent: Event | null;
}

// Add proper type definitions for event handlers
interface VoiceCommandHandler {
  (transcript: string): void;
}

interface QuestionChangeHandler {
  (e: React.ChangeEvent<HTMLTextAreaElement>): void;
}

interface ApiCallHandler {
  (): Promise<void>;
}

// Add proper type definitions for utility functions
interface ExportFunction {
  (): void;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Add proper type definitions for animation variants
interface AnimationVariants {
  initial: {
    opacity: number;
    y: number;
  };
  animate: {
    opacity: number;
    y: number;
  };
  exit: {
    opacity: number;
    y: number;
  };
}

// Add proper type definitions for API interactions
interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
  headers?: Record<string, string>;
  timestamp?: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  retryable?: boolean;
}

// Add proper type definitions for state updates
type StateUpdate<T> = Partial<T> | ((prev: T) => Partial<T>);

// Add proper type definitions for event handlers
interface EventHandlers {
  handleVoiceCommand: VoiceCommandHandler;
  handleQuestionChange: QuestionChangeHandler;
  handleApiCall: ApiCallHandler;
  handleExport: ExportFunction;
  handleValidation: (input: string) => ValidationResult;
  handleLanguageChange: (language: string) => void;
  handleDarkModeToggle: () => void;
  handleFilterToggle: () => void;
  handleCommandToggle: () => void;
}

// Add proper type definitions for component props
interface PulsePalProps {
  apiKey: string;
  initialLanguage?: string;
  onError?: (error: ApiError) => void;
  onSuccess?: (response: GeminiResponse) => void;
  onLanguageChange?: (language: string) => void;
  onDarkModeChange?: (isDarkMode: boolean) => void;
  onFilterChange?: (filters: { search: string; date: string }) => void;
  onCommandChange?: (showCommands: boolean) => void;
}

// Utility function to extract error message from unknown error
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message?: string }).message || 'An unknown error occurred';
  }
  return 'An unknown error occurred';
}

// Update the component to use these types
export function PulsePal({ 
  apiKey, 
  initialLanguage = 'en',
  onError,
  onSuccess,
  onLanguageChange,
  onDarkModeChange,
  onFilterChange,
  onCommandChange
}: PulsePalProps): JSX.Element {
  // Initialize state with proper types
  const [state, setState] = useState<PulsePalState>({
    // Core state
    deals: [],
    events: [],
    question: '',
    response: null,
    loading: false,
    error: null,
    userLocation: null,
    
    // API state
    isApiKeyValid: false,
    availableModels: [],
    selectedModel: '',
    loadingMessage: LOADING_MESSAGES[0],
    loadingState: 'idle',
    retryCount: 0,
    
    // UI state
    showConfetti: false,
    isDarkMode: false,
    showFilters: false,
    showCommands: false,
    isHistoryOpen: false,
    
    // Voice recognition state
    recognition: null,
    isVoiceActive: false,
    voiceFeedback: '',
    voiceRecognition: {
      isActive: false,
      feedback: '',
      language: initialLanguage,
      commands: {}
    },
    
    // Conversation state
    conversations: [],
    selectedConversation: null,
    conversationSearch: '',
    conversationFilter: '',
    isExporting: false,
    
    // Language and localization
    selectedLanguage: initialLanguage,
    
    // Network state
    isOffline: false,
    
    // Search and filter state
    searchQuery: '',
    filterDate: '',
    
    // Selection state
    selectedDeal: null,
    selectedEvent: null
  });

  // Validate API key
  useEffect(() => {
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'API key is required' }));
      toast.error('Configuration Error', {
        description: 'Please provide a valid API key'
      });
      return;
    }
    setState(prev => ({ ...prev, isApiKeyValid: true }));
  }, [apiKey]);

  // Memoized values
  const filteredConversations = useMemo(() => {
    return state.conversations.filter(conv => {
      const matchesSearch = state.searchQuery === '' || 
        conv.question.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        conv.response.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      const matchesDate = state.filterDate === '' || 
        new Date(conv.timestamp).toLocaleDateString() === new Date(state.filterDate).toLocaleDateString();
      
      return matchesSearch && matchesDate;
    });
  }, [state.conversations, state.searchQuery, state.filterDate]);

  // Create export function
  const exportConversations = useCallback(() => {
    setState(prev => ({ ...prev, isExporting: true }));
    try {
      createExportFunction(filteredConversations, state.selectedLanguage)();
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast.error('Failed to export conversations', {
        description: 'Please try again later'
      });
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  }, [filteredConversations, state.selectedLanguage]);

  // Add proper type definitions for handlers
  const handleVoiceCommand: VoiceCommandHandler = useCallback((transcript: string) => {
    try {
      const commands = VOICE_COMMANDS[state.selectedLanguage as keyof typeof VOICE_COMMANDS] || VOICE_COMMANDS.en;
      
      if (commands.search.some(cmd => transcript.toLowerCase().includes(cmd))) {
        const searchTerm = transcript.split(commands.search[0])[1]?.trim();
        if (searchTerm) {
          setState(prev => ({ ...prev, searchQuery: searchTerm }));
          toast.info('Searching...', { description: `Looking for "${searchTerm}"` });
        }
      } else if (commands.filter.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setState(prev => ({ ...prev, showFilters: true, voiceFeedback: VOICE_FEEDBACK.listening[state.selectedLanguage as keyof typeof VOICE_FEEDBACK.listening] || 'Listening...' }));
      } else if (commands.export.some(cmd => transcript.toLowerCase().includes(cmd))) {
        exportConversations();
      } else if (commands.clear.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setState(prev => ({ ...prev, searchQuery: '', filterDate: '', voiceFeedback: '', showFilters: false }));
        toast.success('Filters cleared');
      } else if (commands.help.some(cmd => transcript.toLowerCase().includes(cmd))) {
        setState(prev => ({ ...prev, showCommands: true, voiceFeedback: VOICE_FEEDBACK.commands[state.selectedLanguage as keyof typeof VOICE_FEEDBACK.commands] || VOICE_FEEDBACK.commands.en }));
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command', {
        description: 'Please try again'
      });
    }
  }, [state.selectedLanguage, exportConversations]);

  // Add cleanup for voice recognition
  useEffect(() => {
    let recognitionInstance: SpeechRecognitionInstance | null = null;
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

    if (SpeechRecognition) {
      try {
        recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = VOICE_RECOGNITION_LANGUAGES[state.selectedLanguage as keyof typeof VOICE_RECOGNITION_LANGUAGES] || 'en-US';

        recognitionInstance.onstart = () => {
          if (mounted) {
            setState(prev => ({ ...prev, isVoiceActive: true, voiceFeedback: VOICE_FEEDBACK.listening[state.selectedLanguage as keyof typeof VOICE_FEEDBACK.listening] || 'Listening...' }));
          }
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          try {
            const transcript = event.results[0][0].transcript;
            if (mounted) {
              if (transcript.toLowerCase().startsWith('command')) {
                handleVoiceCommand(transcript);
              } else {
                setState(prev => ({ ...prev, question: transcript }));
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
              setState(prev => ({ ...prev, isVoiceActive: false, voiceFeedback: '' }));
            }
          }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          if (mounted) {
            setState(prev => ({ ...prev, isVoiceActive: false, voiceFeedback: '' }));
            toast.error('Voice input failed', {
              description: 'Could not recognize speech. Please try typing instead.'
            });
          }
        };

        recognitionInstance.onend = () => {
          if (mounted) {
            setState(prev => ({ ...prev, isVoiceActive: false, voiceFeedback: '' }));
          }
        };

        setState(prev => ({ ...prev, recognition: recognitionInstance }));
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
  }, [state.selectedLanguage, handleVoiceCommand]);

  // Add network status handling
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      toast.success(NETWORK_RECOVERY_MESSAGE);
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      toast.error(OFFLINE_MESSAGE);
    };

    // Set initial state
    setState(prev => ({ ...prev, isOffline: !navigator.onLine }));

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add proper type definitions for handlers
  const handleApiCall: ApiCallHandler = async () => {
    // Validate input first
    const validation = validateInput(state.question);
    if (!validation.isValid) {
      setState(prev => ({ ...prev, loadingState: 'error', error: validation.error }));
      toast.error('Invalid Input', {
        description: validation.error
      });
      return;
    }

    if (state.isOffline) {
      setState(prev => ({ ...prev, loadingState: 'error', error: 'Cannot make API calls while offline' }));
      toast.error('Cannot make API calls while offline', {
        description: 'Please check your internet connection'
      });
      return;
    }

    if (!state.isApiKeyValid) {
      setState(prev => ({ ...prev, loadingState: 'error', error: 'Invalid API Key' }));
      toast.error('Invalid API Key', {
        description: 'Please check your configuration'
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loadingState: 'loading', loading: true, error: null }));
      
      // First, get available models with timeout
      const modelsResponse = await Promise.race([
        fetch(`${GEMINI_LIST_MODELS_URL}?key=${apiKey}`),
        timeout(API_TIMEOUT)
      ]) as Response;
      
      if (!modelsResponse.ok) {
        throw new Error('Failed to fetch available models');
      }
      
      const modelsData = await modelsResponse.json() as GeminiModelsResponse;
      const availableModels = modelsData.models
        .filter(model => model.name.startsWith('models/gemini'))
        .map(model => model.name);
      
      setState(prev => ({ 
        ...prev, 
        availableModels,
        selectedModel: availableModels[0] || ''
      }));
      
      if (availableModels.length === 0) {
        throw new Error('No Gemini models available');
      }
      
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
                text: state.question
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
        question: state.question,
        response: generatedText,
        timestamp: new Date().toISOString(),
        language: state.selectedLanguage
      };
      
      setState(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        response: generatedText,
        showConfetti: true,
        loadingState: 'success',
        retryCount: 0,
        loadingMessage: LOADING_MESSAGES[0]
      }));
      
    } catch (error) {
      console.error('API call failed:', error);
      setState(prev => ({
        ...prev,
        error: getErrorMessage(error),
        loadingState: 'error'
      }));
      
      // Implement retry logic with exponential backoff
      if (state.retryCount < MAX_RETRIES) {
        const nextRetry = state.retryCount + 1;
        setState(prev => ({ ...prev, retryCount: nextRetry }));
        const backoffDelay = RETRY_DELAY * Math.pow(2, nextRetry - 1);
        
        toast.error('Request failed', {
          description: `Retrying in ${backoffDelay/1000} seconds... (${nextRetry}/${MAX_RETRIES})`
        });
        
        setTimeout(handleApiCall, backoffDelay);
      } else {
        toast.error('Request failed', {
          description: 'Maximum retry attempts reached. Please try again later.'
        });
        setState(prev => ({ ...prev, retryCount: 0 }));
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Add cleanup for confetti
  useEffect(() => {
    if (state.showConfetti) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, showConfetti: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.showConfetti]);

  // Add loading message rotation
  useEffect(() => {
    if (state.loading) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          loadingMessage: prev.loadingMessage === LOADING_MESSAGES[LOADING_MESSAGES.length - 1]
            ? LOADING_MESSAGES[0]
            : LOADING_MESSAGES[LOADING_MESSAGES.indexOf(prev.loadingMessage) + 1]
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [state.loading]);

  // Add input validation to the question input
  const handleQuestionChange: QuestionChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_QUESTION_LENGTH) {
      setState(prev => ({ ...prev, question: newValue }));
    }
  };

  return (
    <PulsePalErrorBoundary>
      <div className={`space-y-6 ${state.isDarkMode ? 'dark' : ''}`}>
        {/* Offline Indicator */}
        <AnimatePresence>
          {state.isOffline && (
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
            value={state.selectedLanguage}
            onChange={(e) => setState(prev => ({ ...prev, selectedLanguage: e.target.value }))}
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
            value={state.question}
            onChange={handleQuestionChange}
            placeholder="Ask me anything about deals and events..."
            className={`w-full p-4 rounded-lg border ${
              state.question.length > MAX_QUESTION_LENGTH * 0.9
                ? 'border-yellow-300 focus:border-yellow-400'
                : 'border-gray-300 focus:border-purple-400'
            } focus:ring-2 focus:ring-purple-200 transition-colors`}
            rows={4}
            disabled={state.loadingState === 'loading'}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {state.question.length}/{MAX_QUESTION_LENGTH}
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
            disabled={state.loadingState === 'loading' || !state.question.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.loadingState === 'loading'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {state.loadingState === 'loading' ? (
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
            onClick={() => setState(prev => ({ ...prev, isVoiceActive: !prev.isVoiceActive }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              state.isVoiceActive
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {state.isVoiceActive ? (
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
            onClick={() => setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {state.isDarkMode ? (
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
          {state.loadingState === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 text-purple-600"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">{state.loadingMessage}</span>
            </motion.div>
          )}
          {state.loadingState === 'error' && state.error && (
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
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            </motion.div>
          )}
          {state.loadingState === 'success' && (
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
          {state.response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="prose max-w-none">
                {state.response}
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
              disabled={state.isExporting || !state.isApiKeyValid}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isExporting ? (
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
