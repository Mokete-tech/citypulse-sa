
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/cards/EventCard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnvWarning } from '@/components/ui/env-warning';
import { LoadingState } from '@/components/ui/loading-state';
import { fallbackEvents } from '@/data/fallback-data';
import { Search, MapPin, Calendar, ArrowDown, Sliders, CalendarDays } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { addDays, format } from 'date-fns';

const CITIES = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Kimberley',
  'Polokwane',
  'Nelspruit'
];

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Sports',
  'Arts & Culture',
  'Family',
  'Business',
  'Education',
  'Charity',
  'Nightlife',
  'Other'
];

const TIME_FRAMES = [
  { label: 'Today', value: 'today' },
  { label: 'This weekend', value: 'weekend' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Choose date', value: 'custom' }
];

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all-cities');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all-categories');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'soonest');
  const [timeFrame, setTimeFrame] = useState(searchParams.get('timeframe') || 'all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date') as string) : undefined
  );
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Build Supabase query
      let query = supabase.from('events').select('*');
      
      // Apply filters from URL if present
      if (searchParams.get('q')) {
        query = query.ilike('title', `%${searchParams.get('q')}%`);
      }
      
      if (searchParams.get('city') && searchParams.get('city') !== 'all-cities') {
        query = query.eq('city', searchParams.get('city'));
      }
      
      if (searchParams.get('category') && searchParams.get('category') !== 'all-categories') {
        query = query.eq('category', searchParams.get('category'));
      }
      
      if (searchParams.get('featured') === 'true') {
        query = query.eq('featured', true);
      }
      
      // Apply date filters
      if (searchParams.get('timeframe')) {
        const now = new Date();
        const today = format(now, 'yyyy-MM-dd');
        
        switch (searchParams.get('timeframe')) {
          case 'today':
            query = query.eq('date', today);
            break;
          case 'weekend': {
            // Find the next weekend (Friday, Saturday, Sunday)
            const friday = addDays(now, (5 - now.getDay() + 7) % 7);
            const sunday = addDays(friday, 2);
            query = query.gte('date', format(friday, 'yyyy-MM-dd')).lte('date', format(sunday, 'yyyy-MM-dd'));
            break;
          }
          case 'week': {
            // Current week (next 7 days)
            const nextWeek = addDays(now, 7);
            query = query.gte('date', today).lte('date', format(nextWeek, 'yyyy-MM-dd'));
            break;
          }
          case 'month': {
            // Current month
            const nextMonth = addDays(now, 30);
            query = query.gte('date', today).lte('date', format(nextMonth, 'yyyy-MM-dd'));
            break;
          }
          case 'custom': {
            // Custom date
            if (searchParams.get('date')) {
              query = query.eq('date', searchParams.get('date'));
            }
            break;
          }
        }
      }
      
      // Sort the results
      const sortParam = searchParams.get('sort') || 'soonest';
      switch (sortParam) {
        case 'soonest':
          query = query.order('date', { ascending: true });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price_numeric', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price_numeric', { ascending: false });
          break;
        default:
          query = query.order('date', { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching events:', error);
        // Use fallback data
        setEvents(fallbackEvents);
      } else {
        setEvents(data.length > 0 ? data : fallbackEvents);
      }
    } catch (error) {
      console.error('Error:', error);
      // Use fallback data
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCity && selectedCity !== 'all-cities') params.set('city', selectedCity);
    if (selectedCategory && selectedCategory !== 'all-categories') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    if (timeFrame !== 'all') params.set('timeframe', timeFrame);
    if (featuredOnly) params.set('featured', 'true');
    
    // Add date for custom timeframe
    if (timeFrame === 'custom' && selectedDate) {
      params.set('date', format(selectedDate, 'yyyy-MM-dd'));
    }
    
    setSearchParams(params);
    fetchEvents();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all-cities');
    setSelectedCategory('all-categories');
    setSortBy('soonest');
    setTimeFrame('all');
    setSelectedDate(undefined);
    setFeaturedOnly(false);
    setSearchParams({});
    fetchEvents();
  };

  const handleEventClick = async (eventId: number) => {
    try {
      // Track click analytics
      await supabase.from('analytics').insert({
        event_type: 'event_click',
        event_source: 'events_page',
        source_id: eventId,
        metadata: { event_id: eventId }
      });
      
      // Update view count
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('views')
        .eq('id', eventId)
        .single();
        
      if (!fetchError) {
        const currentViews = eventData?.views || 0;
        await supabase
          .from('events')
          .update({ views: currentViews + 1 })
          .eq('id', eventId);
      }
      
      // Navigate to event detail page
      window.location.href = `/events/${eventId}`;
    } catch (error) {
      console.error('Failed to track event click:', error);
      // Still navigate even if tracking fails
      window.location.href = `/events/${eventId}`;
    }
  };

  return (
    <ResponsiveLayout title="Upcoming Events" description="Discover exciting events happening across South Africa">
      <EnvWarning />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filters sidebar - desktop */}
        <div className={`lg:col-span-1 space-y-6 ${isMobile ? 'hidden' : 'block'}`}>
          <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
            <h3 className="font-medium text-lg mb-4">Filters</h3>
            
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="city">Location</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cities</SelectLabel>
                      <SelectItem value="all-cities">All Cities</SelectItem>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>When</Label>
                <RadioGroup value={timeFrame} onValueChange={setTimeFrame} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">Any time</Label>
                  </div>
                  {TIME_FRAMES.map(tf => (
                    <div key={tf.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={tf.value} id={tf.value} />
                      <Label htmlFor={tf.value}>{tf.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {timeFrame === 'custom' && (
                  <div className="pt-2">
                    <Label className="mb-2">Choose a specific date</Label>
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="soonest" id="soonest" />
                    <Label htmlFor="soonest">Happening Soon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="popular" id="popular" />
                    <Label htmlFor="popular">Popularity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_low" id="price_low" />
                    <Label htmlFor="price_low">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_high" id="price_high" />
                    <Label htmlFor="price_high">Price: High to Low</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="featuredOnly" 
                  checked={featuredOnly}
                  onCheckedChange={(checked) => setFeaturedOnly(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="featuredOnly">Featured Events Only</Label>
                  <p className="text-sm text-muted-foreground">Show only featured events</p>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <Button type="submit" className="w-full">Apply Filters</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="pl-10 w-full"
                />
              </div>
            </form>
            
            {isMobile && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Sliders className="h-4 w-4" />
                Filters
              </Button>
            )}
          </div>
          
          {/* Mobile filters (collapsible) */}
          {isMobile && filtersVisible && (
            <div className="bg-white shadow rounded-lg p-5 border border-gray-200 mb-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileCity">City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-cities">All Cities</SelectItem>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobileCategory">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobileTimeFrame">When</Label>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any time</SelectItem>
                      {TIME_FRAMES.map(tf => (
                        <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between gap-4">
                  <Button type="submit" className="flex-1">Apply</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClearFilters}>Clear</Button>
                </div>
              </form>
            </div>
          )}

          {/* Results section */}
          <div>
            {loading ? (
              <LoadingState isLoading={true} type="card" count={6} />
            ) : events.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">{events.length} events found</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-2">Sort:</p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soonest">Happening Soon</SelectItem>
                        <SelectItem value="popular">Popularity</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      merchant_name={event.merchant_name || ""}
                      category={event.category || ""}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      price={event.price || ""}
                      image_url={event.image_url || "/images/placeholders/event-placeholder.svg"}
                      featured={Boolean(event.featured)}
                      onClick={() => handleEventClick(event.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <CalendarDays className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">Try changing your filters or search term</p>
                <Button onClick={handleClearFilters}>Clear filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default EventsPage;
