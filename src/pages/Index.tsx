
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Tag, Calendar, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Track page view
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('analytics').insert({
          event_type: 'page_view',
          event_source: 'home_page',
          metadata: { page: 'home' }
        });
        console.log('Page view tracked');
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, []);

  // Fetch deals and events from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch featured deals
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (dealsError) throw dealsError;
        
        // Fetch featured events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('featured', true)
          .order('date', { ascending: true })
          .limit(3);
        
        if (eventsError) throw eventsError;
        
        setFeaturedDeals(deals || []);
        setFeaturedEvents(events || []);
        
        console.log('Fetched deals:', deals?.length);
        console.log('Fetched events:', events?.length);
        
        // Show fallback data if no deals or events
        if ((!deals || deals.length === 0) && (!events || events.length === 0)) {
          console.log('Using fallback data');
          // If both deals and events are empty, we'll use the fallback data
          setFeaturedDeals(fallbackDeals);
          setFeaturedEvents(fallbackEvents);
        } else {
          // If only one is empty, we'll use the fallback data for that one
          if (!deals || deals.length === 0) {
            setFeaturedDeals(fallbackDeals);
          }
          
          if (!events || events.length === 0) {
            setFeaturedEvents(fallbackEvents);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured content. Using sample data instead.',
          variant: 'destructive',
        });
        
        // Use fallback data in case of error
        setFeaturedDeals(fallbackDeals);
        setFeaturedEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Sample fallback data
  const fallbackDeals = [
    { 
      id: 1, 
      title: "20% Off All Coffee", 
      location: "Cape Town Café", 
      description: "Get 20% off any coffee drink, every Tuesday", 
      expiration_date: "2025-05-15",
      category: "Food & Drink",
      image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "Cape Town Café"
    },
    { 
      id: 2, 
      title: "Buy One Get One Free", 
      location: "Johannesburg Books", 
      description: "Buy one book, get one free of equal or lesser value", 
      expiration_date: "2025-05-20",
      category: "Retail",
      image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "Johannesburg Books"
    },
    { 
      id: 3, 
      title: "30% Off First Visit", 
      location: "Durban Spa & Salon", 
      description: "New customers get 30% off their first service", 
      expiration_date: "2025-06-01",
      category: "Beauty",
      image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "Durban Spa & Salon"
    }
  ];
  
  const fallbackEvents = [
    { 
      id: 1, 
      title: "Jazz Night at V&A Waterfront", 
      date: "2025-05-10", 
      time: "7:00 PM", 
      location: "Cape Town Waterfront",
      description: "Join us for a night of live jazz music with local artists",
      image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "V&A Waterfront"
    },
    { 
      id: 2, 
      title: "Farmers Market", 
      date: "2025-05-17", 
      time: "9:00 AM", 
      location: "Neighbourgoods Market, Johannesburg",
      description: "Fresh local produce, handcrafted goods, and live music",
      image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "Neighbourgoods Market"
    },
    { 
      id: 3, 
      title: "Tech Meetup", 
      date: "2025-05-22", 
      time: "6:30 PM", 
      location: "Durban Digital Hub",
      description: "Networking event for tech professionals and enthusiasts",
      image_url: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      merchant_name: "Durban Digital Hub"
    }
  ];

  // Function to track deal clicks
  const trackDealClick = async (dealId) => {
    try {
      await supabase.from('analytics').insert({
        event_type: 'deal_click',
        event_source: 'home_page',
        source_id: dealId,
        metadata: { deal_id: dealId }
      });

      // Also increment views counter in deals table
      await supabase
        .from('deals')
        .update({ views: supabase.rpc('increment', { row_id: dealId, amount: 1 }) })
        .eq('id', dealId);
    } catch (error) {
      console.error('Failed to track deal click:', error);
    }
  };

  // Function to track event clicks
  const trackEventClick = async (eventId) => {
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to CityPulse South Africa</h1>
            <p className="text-muted-foreground">
              Discover the best local deals and events throughout South Africa.
            </p>
          </div>
          
          {/* Featured Deals Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Deals</h2>
              </div>
              <Link to="/deals">
                <Button variant="ghost" className="gap-1 text-primary">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full flex flex-col animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDeals.map((deal) => (
                  <Card key={deal.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                    {deal.image_url && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={deal.image_url} 
                          alt={deal.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="text-sm text-muted-foreground mb-1">{deal.category}</div>
                      <CardTitle>{deal.title}</CardTitle>
                      <CardDescription>{deal.merchant_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p>{deal.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Expires: {new Date(deal.expiration_date).toLocaleDateString()}
                      </div>
                      <Link to={`/deals/${deal.id}`}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => trackDealClick(deal.id)}
                        >
                          View Deal
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
          
          {/* Featured Events Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              </div>
              <Link to="/events">
                <Button variant="ghost" className="gap-1 text-primary">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full flex flex-col animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <Card key={event.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                    {event.image_url && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p>{event.description}</p>
                      <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link to={`/events/${event.id}`}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => trackEventClick(event.id)}
                        >
                          View Event
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
