
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { EventCard } from '@/components/cards/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { SearchIcon, Calendar, MapPin, Clock, X } from 'lucide-react';
import { fallbackEvents } from '@/data/fallback-data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  // Category display names mapping
  const categoryNames: Record<string, string> = {
    'music': 'Music',
    'food-shopping': 'Food & Shopping',
    'networking': 'Networking',
    'sports': 'Sports',
    'arts': 'Arts & Culture'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    navigate('/events');
  };

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('events')
        .select('*');

      // Apply category filter if present
      if (categoryFilter) {
        // Convert URL parameter format to database format
        const dbCategory = categoryFilter === 'food-shopping'
          ? 'Food & Shopping'
          : categoryFilter === 'arts'
            ? 'Arts & Culture'
            : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);

        query = query.ilike('category', dbCategory);
      }

      // Add ordering
      query = query.order('date', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // If no results and we have a category filter, use filtered fallback data
      if ((!data || data.length === 0) && categoryFilter) {
        const filteredFallbacks = fallbackEvents.filter(event =>
          event.category.toLowerCase().includes(categoryFilter.replace('-', ' '))
        );
        setEvents(filteredFallbacks.length > 0 ? filteredFallbacks : fallbackEvents);
      } else {
        setEvents(data || fallbackEvents);
      }
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading events',
        message: 'Could not load events. Using fallback data instead.',
        silent: true
      });

      // If we have a category filter, use filtered fallback data
      if (categoryFilter) {
        const filteredFallbacks = fallbackEvents.filter(event =>
          event.category.toLowerCase().includes(categoryFilter.replace('-', ' '))
        );
        setEvents(filteredFallbacks.length > 0 ? filteredFallbacks : fallbackEvents);
      } else {
        setEvents(fallbackEvents);
      }

      setError('Failed to load events. Showing sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Local Events</h1>
            <p className="text-muted-foreground">
              Discover all upcoming events across South Africa.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events by name or location..."
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Active category filter */}
            {categoryFilter && (
              <div className="mt-4 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categoryNames[categoryFilter] || categoryFilter}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={clearCategoryFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>

          <LoadingState isLoading={loading} type="card" count={6}>
            {/* Don't show error in production */}
            {error && !import.meta.env.PROD && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  merchant_name={event.merchant_name}
                  category={event.category}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  price={event.price}
                  image_url={event.imageUrl || event.image_url}
                  featured={event.featured}
                />
              ))}
            </div>
          </LoadingState>

          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Events;
