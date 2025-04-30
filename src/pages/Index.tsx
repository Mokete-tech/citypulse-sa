
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Calendar, AlertCircle } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { handleError, handleSupabaseError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fallbackDeals, fallbackEvents } from '@/data/fallback-data';

// Use the interfaces from fallback-data.ts
import type { Deal, Event } from '@/data/fallback-data';

const Index = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch deals
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .limit(3);

        if (dealsError) {
          handleSupabaseError(dealsError, {
            title: "Error fetching deals",
            silent: true
          });
          // Don't set error state yet, we'll still try to fetch events
        } else {
          setDeals(dealsData || []);
        }

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .limit(3);

        if (eventsError) {
          handleSupabaseError(eventsError, {
            title: "Error fetching events",
            silent: true
          });

          // If both requests failed, show an error message
          if (dealsError) {
            setError("Failed to load content. Using fallback data instead.");
            toast.error("Connection error", {
              description: "Could not connect to the database. Showing sample data instead."
            });
          }
        } else {
          setEvents(eventsData || []);
        }
      } catch (err) {
        handleError(err, {
          title: "Error loading content",
          message: "An unexpected error occurred. Showing sample data instead."
        });
        setError("Failed to load content. Using fallback data instead.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('analytics').insert({
          event_type: 'page_view',
          event_source: 'home_page',
          source_id: 0, // Adding source_id as required by the schema
          metadata: { page: 'home' }
        });
      } catch (error) {
        // Just log the error but don't show to user since analytics errors are non-critical
        handleError(error, { silent: true });
      }
    };

    // Only track page views if we're not in development mode
    if (import.meta.env.MODE !== 'development') {
      trackPageView();
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDealClick = async (dealId: number) => {
    try {
      await supabase.from('analytics').insert({
        event_type: 'deal_click',
        event_source: 'home_page',
        source_id: dealId,
        metadata: { deal_id: dealId }
      });

      // Update views counter in deals table
      const { error } = await supabase
        .from('deals')
        .update({ views: () => 'views + 1' })
        .eq('id', dealId);

      if (error) {
        console.error('Failed to update view count:', error);
      }
    } catch (error) {
      console.error('Failed to track deal click:', error);
    }
  };

  const handleEventClick = async (eventId: number) => {
    try {
      await supabase.from('analytics').insert({
        event_type: 'event_click',
        event_source: 'home_page',
        source_id: eventId,
        metadata: { event_id: eventId }
      });
    } catch (error) {
      console.error('Failed to track event click:', error);
    }
  };

  // Fallback data in case the database fetch fails
  const fallbackDeals: Deal[] = [
    {
      id: 1,
      title: "20% Off All Coffee",
      description: "Get 20% off any coffee drink, every Tuesday",
      category: "Food & Drink",
      expiration_date: "2025-05-15",
      merchant_name: "Cape Town Café"
    },
    {
      id: 2,
      title: "Buy One Get One Free",
      description: "Buy one book, get one free of equal or lesser value",
      category: "Retail",
      expiration_date: "2025-05-20",
      merchant_name: "Johannesburg Books"
    },
    {
      id: 3,
      title: "30% Off First Visit",
      description: "New customers get 30% off their first service",
      category: "Beauty",
      expiration_date: "2025-06-01",
      merchant_name: "Durban Spa & Salon"
    }
  ];

  const fallbackEvents: Event[] = [
    {
      id: 1,
      title: "Jazz Night at V&A Waterfront",
      description: "Join us for a night of live jazz music with local artists",
      date: "2025-05-10",
      time: "7:00 PM",
      location: "Cape Town Waterfront"
    },
    {
      id: 2,
      title: "Farmers Market",
      description: "Fresh local produce, handcrafted goods, and live music",
      date: "2025-05-17",
      time: "9:00 AM",
      location: "Neighbourgoods Market, Johannesburg"
    },
    {
      id: 3,
      title: "Tech Meetup",
      description: "Networking event for tech professionals and enthusiasts",
      date: "2025-05-22",
      time: "6:30 PM",
      location: "Durban Digital Hub"
    }
  ];

  // Use fallback data if no deals or events are returned from the database
  const displayDeals = deals.length > 0 ? deals : fallbackDeals;
  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to CityPulse South Africa</h1>
              <p className="text-muted-foreground">
                Discover the best local deals and events across South Africa.
              </p>
              {error && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Featured Deals
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {loading ? (
                    <LoadingState isLoading={true} type="card" count={3} />
                  ) : (
                    displayDeals.map(deal => (
                      <Card key={deal.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{deal.title}</CardTitle>
                          <CardDescription>{deal.merchant_name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{deal.description}</p>
                          {deal.category && (
                            <div className="mt-2 text-sm flex items-center gap-1 text-muted-foreground">
                              <Tag className="h-3 w-3" /> {deal.category}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          {deal.expiration_date && (
                            <span className="text-sm text-muted-foreground">
                              Expires: {deal.expiration_date}
                            </span>
                          )}
                          <Link to={`/deals/${deal.id}`} onClick={() => handleDealClick(deal.id)}>
                            <Button size="sm">View Deal</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>

                <div className="mt-4">
                  <Link to="/deals">
                    <Button variant="outline">View All Deals</Button>
                  </Link>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Upcoming Events
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {loading ? (
                    <LoadingState isLoading={true} type="card" count={3} />
                  ) : (
                    displayEvents.map(event => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{event.title}</CardTitle>
                          {event.date && event.time && (
                            <CardDescription>
                              {event.date} at {event.time}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p>{event.description}</p>
                          {event.location && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {event.location}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Link to={`/events/${event.id}`} onClick={() => handleEventClick(event.id)}>
                            <Button size="sm">View Event</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>

                <div className="mt-4">
                  <Link to="/events">
                    <Button variant="outline">View All Events</Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
