import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Define user preferences types
export interface UserPreferences {
  categories: string[];
  maxDistance: number;
  priceRange: [number, number];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  favoriteLocations: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }[];
  hiddenMerchants: string[];
  theme: 'light' | 'dark' | 'system';
  recentSearches: string[];
  favoriteItems: {
    id: string;
    type: 'deal' | 'event';
  }[];
}

// Default preferences
const defaultPreferences: UserPreferences = {
  categories: [],
  maxDistance: 10,
  priceRange: [0, 1000],
  notificationPreferences: {
    email: true,
    push: false,
    sms: false,
  },
  emailFrequency: 'weekly',
  favoriteLocations: [],
  hiddenMerchants: [],
  theme: 'system',
  recentSearches: [],
  favoriteItems: [],
};

// Create context
interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  addFavoriteItem: (id: string, type: 'deal' | 'event') => Promise<void>;
  removeFavoriteItem: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  addRecentSearch: (search: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Provider component
export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load preferences on mount and when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      
      try {
        // Try to load from Supabase if user is logged in
        if (user) {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error('Error loading preferences from Supabase:', error);
            // Fall back to localStorage
            loadFromLocalStorage();
          } else if (data) {
            setPreferences({
              ...defaultPreferences,
              ...data.preferences,
            });
          } else {
            // No preferences found in database, fall back to localStorage
            loadFromLocalStorage();
          }
        } else {
          // User not logged in, load from localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadFromLocalStorage = () => {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        try {
          const parsedPreferences = JSON.parse(storedPreferences);
          setPreferences({
            ...defaultPreferences,
            ...parsedPreferences,
          });
        } catch (error) {
          console.error('Error parsing stored preferences:', error);
          setPreferences(defaultPreferences);
        }
      } else {
        setPreferences(defaultPreferences);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  // Save preferences
  const savePreferences = async (newPreferences: UserPreferences) => {
    // Save to localStorage for all users
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences: newPreferences,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          });
        
        if (error) {
          console.error('Error saving preferences to Supabase:', error);
          toast.error('Failed to save preferences to your account');
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error('Failed to save preferences');
      }
    }
  };
  
  // Update preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };
  
  // Reset preferences to defaults
  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    await savePreferences(defaultPreferences);
    toast.success('Preferences reset to defaults');
  };
  
  // Add favorite item
  const addFavoriteItem = async (id: string, type: 'deal' | 'event') => {
    const updatedPreferences = {
      ...preferences,
      favoriteItems: [
        ...preferences.favoriteItems,
        { id, type },
      ],
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
    toast.success(`Added to favorites`);
  };
  
  // Remove favorite item
  const removeFavoriteItem = async (id: string) => {
    const updatedPreferences = {
      ...preferences,
      favoriteItems: preferences.favoriteItems.filter(item => item.id !== id),
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
    toast.success(`Removed from favorites`);
  };
  
  // Check if item is favorite
  const isFavorite = (id: string) => {
    return preferences.favoriteItems.some(item => item.id === id);
  };
  
  // Add recent search
  const addRecentSearch = async (search: string) => {
    // Don't add empty searches
    if (!search.trim()) return;
    
    // Don't add duplicates
    if (preferences.recentSearches.includes(search)) return;
    
    // Limit to 10 recent searches
    const newSearches = [
      search,
      ...preferences.recentSearches.filter(s => s !== search),
    ].slice(0, 10);
    
    const updatedPreferences = {
      ...preferences,
      recentSearches: newSearches,
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };
  
  // Clear recent searches
  const clearRecentSearches = async () => {
    const updatedPreferences = {
      ...preferences,
      recentSearches: [],
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
    toast.success('Recent searches cleared');
  };
  
  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = preferences;
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    applyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preferences.theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [preferences.theme]);
  
  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updatePreferences,
        resetPreferences,
        addFavoriteItem,
        removeFavoriteItem,
        isFavorite,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

// Hook to use preferences
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  return context;
};

export default usePreferences;
