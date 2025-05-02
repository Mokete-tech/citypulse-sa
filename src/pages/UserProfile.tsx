import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { User, Settings, Bell, Heart, MapPin, LogOut } from 'lucide-react';
import { DealCard } from '@/components/cards/DealCard';
import { EventCard } from '@/components/cards/EventCard';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  preferences: {
    categories: string[];
    locations: string[];
    notification_email: boolean;
    notification_sms: boolean;
    notification_push: boolean;
  };
}

interface SavedItem {
  id: number;
  user_id: string;
  item_id: number;
  item_type: 'deal' | 'event';
  created_at: string;
  deal?: any;
  event?: any;
}

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        // If profile exists, use it; otherwise create default profile
        if (data) {
          setProfile({
            ...data,
            preferences: data.preferences || {
              categories: [],
              locations: [],
              notification_email: true,
              notification_sms: false,
              notification_push: true
            }
          });
        } else {
          // Create default profile
          const defaultProfile = {
            id: user.id,
            first_name: '',
            last_name: '',
            email: user.email || '',
            phone: user.phone || '',
            avatar_url: '',
            preferences: {
              categories: [],
              locations: [],
              notification_email: true,
              notification_sms: false,
              notification_push: true
            }
          };
          setProfile(defaultProfile);

          // Save default profile to database
          await supabase.from('profiles').insert([defaultProfile]);
        }

        // Fetch saved items
        const { data: savedItemsData, error: savedItemsError } = await supabase
          .from('saved_items')
          .select(`
            *,
            deal:deals(*),
            event:events(*)
          `)
          .eq('user_id', user.id);

        if (savedItemsError) {
          throw savedItemsError;
        }

        setSavedItems(savedItemsData || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleProfileUpdate = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          preferences: profile.preferences
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    if (!profile) return;

    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: value
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Saved</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={profile?.first_name || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={profile?.last_name || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile?.email || ''}
                        onChange={handleInputChange}
                        disabled={!!user?.email}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile?.phone || ''}
                        onChange={handleInputChange}
                        disabled={!!user?.phone}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleProfileUpdate} disabled={saving}>
                      {saving ? <LoadingSpinner className="mr-2" /> : null}
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Preferences</CardTitle>
                    <CardDescription>
                      Customize your experience by setting your preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Favorite Categories</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Food & Drink', 'Retail', 'Beauty', 'Entertainment', 'Health & Fitness', 'Travel'].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Switch
                              id={`category-${category}`}
                              checked={profile?.preferences.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (!profile) return;
                                const categories = checked
                                  ? [...profile.preferences.categories, category]
                                  : profile.preferences.categories.filter(c => c !== category);
                                handlePreferenceChange('categories', categories);
                              }}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Preferred Locations</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'].map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Switch
                              id={`location-${location}`}
                              checked={profile?.preferences.locations.includes(location)}
                              onCheckedChange={(checked) => {
                                if (!profile) return;
                                const locations = checked
                                  ? [...profile.preferences.locations, location]
                                  : profile.preferences.locations.filter(l => l !== location);
                                handlePreferenceChange('locations', locations);
                              }}
                            />
                            <Label htmlFor={`location-${location}`}>{location}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        You can also enable location services to see deals and events near you.
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleProfileUpdate} disabled={saving}>
                      {saving ? <LoadingSpinner className="mr-2" /> : null}
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications about deals and events.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notification_email">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new deals and events via email.
                          </p>
                        </div>
                        <Switch
                          id="notification_email"
                          checked={profile?.preferences.notification_email}
                          onCheckedChange={(checked) => handlePreferenceChange('notification_email', checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notification_sms">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new deals and events via SMS.
                          </p>
                        </div>
                        <Switch
                          id="notification_sms"
                          checked={profile?.preferences.notification_sms}
                          onCheckedChange={(checked) => handlePreferenceChange('notification_sms', checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notification_push">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications when new deals and events are available.
                          </p>
                        </div>
                        <Switch
                          id="notification_push"
                          checked={profile?.preferences.notification_push}
                          onCheckedChange={(checked) => handlePreferenceChange('notification_push', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleProfileUpdate} disabled={saving}>
                      {saving ? <LoadingSpinner className="mr-2" /> : null}
                      Save Notification Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Saved Items Tab */}
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription>
                      View and manage your saved deals and events.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No saved items yet</h3>
                        <p className="mt-2 text-muted-foreground">
                          Save deals and events by clicking the heart icon.
                        </p>
                        <Button className="mt-4" onClick={() => navigate('/')}>
                          Browse Deals and Events
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Saved Deals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedItems
                            .filter(item => item.item_type === 'deal' && item.deal)
                            .map(item => (
                              <DealCard
                                key={`deal-${item.item_id}`}
                                id={item.item_id}
                                title={item.deal.title}
                                description={item.deal.description}
                                merchant_name={item.deal.merchant_name}
                                category={item.deal.category}
                                expiration_date={item.deal.expiration_date}
                                discount={item.deal.discount}
                                image_url={item.deal.image_url}
                                featured={item.deal.featured}
                                onClick={() => navigate(`/deals/${item.item_id}`)}
                              />
                            ))}
                        </div>

                        <h3 className="text-lg font-medium mt-8">Saved Events</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedItems
                            .filter(item => item.item_type === 'event' && item.event)
                            .map(item => (
                              <EventCard
                                key={`event-${item.item_id}`}
                                id={item.item_id}
                                title={item.event.title}
                                description={item.event.description}
                                merchant_name={item.event.merchant_name}
                                category={item.event.category}
                                date={item.event.date}
                                time={item.event.time}
                                location={item.event.location}
                                price={item.event.price}
                                image_url={item.event.image_url}
                                featured={item.event.featured}
                                onClick={() => navigate(`/events/${item.item_id}`)}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default UserProfile;
