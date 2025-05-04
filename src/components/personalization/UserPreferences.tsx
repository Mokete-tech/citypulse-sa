import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
};

interface UserPreferencesProps {
  onSave?: (preferences: UserPreferences) => void;
  onCancel?: () => void;
  availableCategories: string[];
  availableMerchants: string[];
  className?: string;
}

const UserPreferences = ({
  onSave,
  onCancel,
  availableCategories,
  availableMerchants,
  className = '',
}: UserPreferencesProps) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load user preferences on component mount
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
            console.error('Error loading preferences:', error);
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
  const savePreferences = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage for all users
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Save to Supabase if user is logged in
      if (user) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          });
        
        if (error) {
          console.error('Error saving preferences to database:', error);
          toast.error('Failed to save preferences to your account');
        }
      }
      
      toast.success('Preferences saved successfully');
      
      if (onSave) {
        onSave(preferences);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset preferences to defaults
  const resetPreferences = () => {
    if (confirm('Are you sure you want to reset all preferences to default values?')) {
      setPreferences(defaultPreferences);
      toast.success('Preferences reset to defaults');
    }
  };
  
  // Toggle category preference
  const toggleCategory = (category: string) => {
    setPreferences(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };
  
  // Toggle hidden merchant
  const toggleHiddenMerchant = (merchantId: string) => {
    setPreferences(prev => {
      const newHiddenMerchants = prev.hiddenMerchants.includes(merchantId)
        ? prev.hiddenMerchants.filter(m => m !== merchantId)
        : [...prev.hiddenMerchants, merchantId];
      
      return {
        ...prev,
        hiddenMerchants: newHiddenMerchants,
      };
    });
  };
  
  // Update max distance
  const updateMaxDistance = (value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      maxDistance: value[0],
    }));
  };
  
  // Update price range
  const updatePriceRange = (value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };
  
  // Toggle notification preference
  const toggleNotification = (type: 'email' | 'push' | 'sms') => {
    setPreferences(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type],
      },
    }));
  };
  
  // Update email frequency
  const updateEmailFrequency = (frequency: 'daily' | 'weekly' | 'monthly' | 'never') => {
    setPreferences(prev => ({
      ...prev,
      emailFrequency: frequency,
    }));
  };
  
  // Update theme
  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({
      ...prev,
      theme,
    }));
  };
  
  // Clear recent searches
  const clearRecentSearches = () => {
    setPreferences(prev => ({
      ...prev,
      recentSearches: [],
    }));
    toast.success('Recent searches cleared');
  };
  
  // Remove a favorite location
  const removeFavoriteLocation = (locationId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(loc => loc.id !== locationId),
    }));
  };
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading preferences...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Preferences</CardTitle>
        <CardDescription>
          Customize your experience on CityPulse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="interests">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Interests Tab */}
          <TabsContent value="interests" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Preferred Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={preferences.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {preferences.categories.length === 0 
                  ? "You'll see deals and events from all categories" 
                  : `You'll see deals and events primarily from your selected categories`}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Maximum Distance</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Within {preferences.maxDistance} km</span>
                </div>
                <Slider
                  value={[preferences.maxDistance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={updateMaxDistance}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>R{preferences.priceRange[0]} - R{preferences.priceRange[1]}</span>
                </div>
                <Slider
                  value={[preferences.priceRange[0], preferences.priceRange[1]]}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={updatePriceRange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R0</span>
                  <span>R1000+</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Hidden Merchants</h3>
              {preferences.hiddenMerchants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven't hidden any merchants yet. Hide merchants to stop seeing their deals and events.
                </p>
              ) : (
                <div className="space-y-2">
                  {preferences.hiddenMerchants.map(merchantId => {
                    const merchantName = availableMerchants.find(m => m === merchantId) || merchantId;
                    return (
                      <Badge 
                        key={merchantId} 
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => toggleHiddenMerchant(merchantId)}
                      >
                        {merchantName}
                        <span className="text-xs">×</span>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
              {preferences.recentSearches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Your recent searches will appear here.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferences.recentSearches.map((search, index) => (
                      <Badge key={index} variant="secondary">
                        {search}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearRecentSearches}
                  >
                    Clear Search History
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Notification Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive deal alerts and updates via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={preferences.notificationPreferences.email}
                    onCheckedChange={() => toggleNotification('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts directly on your device
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={preferences.notificationPreferences.push}
                    onCheckedChange={() => toggleNotification('push')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive text messages for important alerts
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={preferences.notificationPreferences.sms}
                    onCheckedChange={() => toggleNotification('sms')}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Email Frequency</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={preferences.emailFrequency === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateEmailFrequency('daily')}
                >
                  Daily Digest
                </Button>
                <Button 
                  variant={preferences.emailFrequency === 'weekly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateEmailFrequency('weekly')}
                >
                  Weekly Roundup
                </Button>
                <Button 
                  variant={preferences.emailFrequency === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateEmailFrequency('monthly')}
                >
                  Monthly Summary
                </Button>
                <Button 
                  variant={preferences.emailFrequency === 'never' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateEmailFrequency('never')}
                >
                  No Regular Emails
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {preferences.emailFrequency === 'never' 
                  ? "You won't receive regular email updates" 
                  : `You'll receive a ${preferences.emailFrequency} summary of new deals and events`}
              </p>
            </div>
          </TabsContent>
          
          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Favorite Locations</h3>
              {preferences.favoriteLocations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven't saved any favorite locations yet. Save locations to quickly filter deals and events.
                </p>
              ) : (
                <div className="space-y-2">
                  {preferences.favoriteLocations.map(location => (
                    <div key={location.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFavoriteLocation(location.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  // This would normally open a location picker
                  toast.info('Location picker would open here');
                }}
              >
                Add New Location
              </Button>
            </div>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={preferences.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('light')}
                  className="justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  Light
                </Button>
                <Button 
                  variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('dark')}
                  className="justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  Dark
                </Button>
                <Button 
                  variant={preferences.theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme('system')}
                  className="justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                  System
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetPreferences}
        >
          Reset to Defaults
        </Button>
        <div className="flex gap-2">
          {onCancel && (
            <Button 
              variant="ghost" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={savePreferences}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserPreferences;
