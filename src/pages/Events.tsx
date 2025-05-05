
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { EventCard } from '@/components/cards/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { SearchIcon, Calendar, MapPin, Clock } from 'lucide-react';
import { fallbackEvents } from '@/data/fallback-data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || fallbackEvents);
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading events',
        message: 'Could not load events. Using fallback data instead.',
        silent: true
      });
      setError('Failed to load events. Showing sample data instead.');
      setEvents(fallbackEvents);
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
          </div>

          <LoadingState isLoading={loading} type="card" count={6}>
            {error && (
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
