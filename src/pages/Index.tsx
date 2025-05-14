
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Tag, Calendar } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';
import { fallbackDeals, fallbackEvents } from '@/data/fallback-data';
import { EnvWarning } from '@/components/ui/env-warning';
import { DealCard } from '@/components/cards/DealCard';
import { EventCard } from '@/components/cards/EventCard';
import NearbyDeals from '@/components/location/NearbyDeals';
import NearbyEvents from '@/components/location/NearbyEvents';

// Use the interfaces from fallback-data.ts
import type { Deal, Event } from '@/data/fallback-data';

const Index = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  // We're not showing errors anymore, but keeping the state for future use
  const [, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        // Check if Supabase connection is working
        let connectionError = null;
        try {
          // Simple query to check if connection is working - use deals table since we know it exists
          const { error } = await supabase.from('deals').select('id').limit(1);
          connectionError = error;
        } catch (err) {
          console.error("Connection check failed:", err);
          connectionError = err;
        }

        if (connectionError && retryCount < 2) {
          console.log(`Connection attempt ${retryCount + 1} failed, retrying...`);
          setTimeout(() => fetchData(retryCount + 1), 1500); // Retry after 1.5 seconds
          return;
        }

        // Fetch deals with error handling and retry
        let dealsData = null;
        let dealsError = null;

        try {
          const dealsResponse = await supabase
            .from('deals')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

          dealsData = dealsResponse.data;
          dealsError = dealsResponse.error;
        } catch (err) {
          console.error("Error fetching deals:", err);
          dealsError = err;
        }

        if (dealsError) {
          console.warn("Using fallback deals data due to error:", dealsError);
          setDeals(fallbackDeals);
        } else {
          // If we got data but it's empty, use fallback data
          setDeals(dealsData && dealsData.length > 0 ? dealsData : fallbackDeals);
        }

        // Fetch events with error handling and retry
        let eventsData = null;
        let eventsError = null;

        try {
          const eventsResponse = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
            .limit(3);

          eventsData = eventsResponse.data;
          eventsError = eventsResponse.error;
        } catch (err) {
          console.error("Error fetching events:", err);
          eventsError = err;
        }

        if (eventsError) {
          console.warn("Using fallback events data due to error:", eventsError);
          setEvents(fallbackEvents);
        } else {
          // If we got data but it's empty, use fallback data
          setEvents(eventsData && eventsData.length > 0 ? eventsData : fallbackEvents);
        }

        // Show error message if both requests failed
        if (dealsError && eventsError) {
          if (retryCount >= 2) {
            setError("Failed to load content. Using fallback data instead.");
            toast.error("Connection error", {
              description: "Could not connect to the database. Showing sample data instead."
            });
          } else {
            // Retry one more time
            console.log(`Both requests failed on attempt ${retryCount + 1}, retrying...`);
            setTimeout(() => fetchData(retryCount + 1), 2000); // Retry after 2 seconds
            return;
          }
        } else {
          // Clear any previous error if at least one request succeeded
          setError(null);
        }
      } catch (err) {
        handleError(err, {
          title: "Error loading content",
          message: "An unexpected error occurred. Showing sample data instead."
        });

        if (retryCount < 2) {
          // Retry one more time
          console.log(`Unexpected error on attempt ${retryCount + 1}, retrying...`);
          setTimeout(() => fetchData(retryCount + 1), 2000); // Retry after 2 seconds
          return;
        }

        setError("Failed to load content. Using fallback data instead.");
        // Ensure fallback data is set in case of unexpected errors
        setDeals(fallbackDeals);
        setEvents(fallbackEvents);
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

      // First get the current views count
      const { data: dealData, error: fetchError } = await supabase
        .from('deals')
        .select('views')
        .eq('id', dealId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch view count:', fetchError);
        return;
      }

      // Update views counter in deals table
      const currentViews = dealData?.views || 0;
      const { error } = await supabase
        .from('deals')
        .update({ views: currentViews + 1 })
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

  // Using fallback data imported from @/data/fallback-data

  // Use fallback data if no deals or events are returned from the database
  const displayDeals = deals.length > 0 ? deals : fallbackDeals;
  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {/* Environment warning will only show in development mode */}
            <EnvWarning />

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to CityPulse South Africa</h1>
              <p className="text-muted-foreground">
                Discover the best local deals and events across South Africa.
              </p>
              {/* Don't show any error messages */}
            </div>

            {/* Nearby Deals and Events Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NearbyDeals initialRadius={5} maxDeals={3} />
                <NearbyEvents initialRadius={5} maxEvents={3} />
              </div>
            </div>

            {/* Featured Deals and Events Section */}
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
                      <DealCard
                        key={deal.id}
                        id={deal.id}
                        title={deal.title}
                        description={deal.description}
                        merchant_name={deal.merchant_name}
                        category={deal.category}
                        expiration_date={deal.expiration_date}
                        discount={deal.discount || ""}
                        image_url={deal.image_url || "/placeholder-deal.jpg"}
                        featured={Boolean(deal.featured)}
                        onClick={() => {
                          handleDealClick(deal.id);
                          window.location.href = `/deals/${deal.id}`;
                        }}
                      />
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
                        image_url={event.image_url || "/placeholder-event.jpg"}
                        featured={Boolean(event.featured)}
                        onClick={() => {
                          handleEventClick(event.id);
                          window.location.href = `/events/${event.id}`;
                        }}
                      />
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
