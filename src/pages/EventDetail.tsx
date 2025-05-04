import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Calendar, Tag, Store, Clock, Ticket } from 'lucide-react';
import { fallbackEvents } from '@/data/fallback-data';
import { ReactionButton } from '@/components/ui/reaction-button';
import { ShareButton } from '@/components/ui/share-button';
import VideoAd from '@/components/ads/VideoAd';
import { toast } from 'sonner';
import SEO from '@/components/seo/SEO';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('Event ID is required');
        }

        // First set a fallback event to ensure something displays
        const fallbackEvent = fallbackEvents.find(e => e.id.toString() === id) || fallbackEvents[0];
        if (fallbackEvent) {
          setEvent(fallbackEvent);
        }

        // Try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', parseInt(id || '0', 10))
            .single();

          if (error) {
            console.error('Supabase query error:', error);
            // Already using fallback event, so just log the error
          } else if (data) {
            // Update with real event data
            setEvent(data);

            // Try to track view
            try {
              await trackEventView(data.id);
            } catch (trackError) {
              console.error('Error tracking event view:', trackError);
              // Non-critical error, continue showing the event
            }
          }
        } catch (supabaseError) {
          console.error('Error fetching from Supabase:', supabaseError);
          // Already using fallback event, so just log the error
        }
      } catch (error) {
        console.error('Error in EventDetail component:', error);

        // Try to use fallback data as a last resort
        const fallbackEvent = fallbackEvents.find(e => e.id.toString() === id) || fallbackEvents[0];
        if (fallbackEvent) {
          setEvent(fallbackEvent);
        } else {
          setError('Event not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const trackEventView = async (eventId: number) => {
    try {
      // Track analytics
      await supabase.from('analytics').insert({
        event_type: 'event_view',
        event_source: 'event_page',
        source_id: eventId,
        metadata: { event_id: eventId }
      });

      // Update view count
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('views')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch view count:', fetchError);
        return;
      }

      const currentViews = eventData?.views || 0;
      await supabase
        .from('events')
        .update({ views: currentViews + 1 })
        .eq('id', eventId);
    } catch (error) {
      console.error('Failed to track event view:', error);
    }
  };

  const handleGetTickets = async () => {
    try {
      if (event?.ticket_url) {
        // Track click
        if (event?.id) {
          await supabase.from('analytics').insert({
            event_type: 'ticket_click',
            event_source: 'event_page',
            source_id: event.id,
            metadata: { event_id: event.id }
          });
        }
        
        // Open ticket URL in new tab
        window.open(event.ticket_url, '_blank');
      } else {
        toast.info('Ticket information', {
          description: 'Contact the event organizer for ticket information.'
        });
      }
    } catch (error) {
      console.error('Failed to track ticket click:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 md:p-6">
            <LoadingState isLoading={true} type="card" count={1} />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate('/events')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-semibold text-red-800 mb-2">
                    {error || 'Event not found'}
                  </h2>
                  <p className="text-red-600 mb-4">
                    We couldn't find the event you're looking for.
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    Browse All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SEO
        title={`${event.title} | CityPulse South Africa`}
        description={event.description}
        ogImage={event.image_url}
        ogType="article"
      />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {event.image_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    {event.category && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Tag className="h-3 w-3" />
                        {event.category}
                      </div>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold">{event.title}</h1>

                    {event.merchant_name && (
                      <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                        <Store className="h-4 w-4" />
                        {event.merchant_name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {event.featured && (
                      <Badge variant="outline" className="mb-2">Featured</Badge>
                    )}

                    {event.ticket_price && (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {event.ticket_price}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">{event.description}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-b py-4 mb-6">
                  <div className="flex flex-col gap-2">
                    {event.event_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.event_date}</span>
                      </div>
                    )}

                    {(event.start_time || event.end_time) && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.start_time && `From ${event.start_time}`}
                          {event.start_time && event.end_time && ' to '}
                          {event.end_time && event.end_time}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.venue}</span>
                      </div>
                    )}

                    {event.location && event.venue && event.venue !== event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Large Share Button - More Prominent */}
                <div className="flex justify-center my-6">
                  <ShareButton
                    itemId={typeof event.id === 'string' ? parseInt(event.id, 10) : event.id}
                    itemType="event"
                    title={event.title}
                    description={event.description}
                    imageUrl={event.image_url}
                    variant="default"
                    size="lg"
                    className="w-full md:w-auto px-8"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <ReactionButton itemId={typeof event.id === 'string' ? parseInt(event.id, 10) : event.id} itemType="event" />
                  </div>

                  <Button onClick={handleGetTickets} size="lg">
                    <Ticket className="mr-2 h-4 w-4" />
                    {event.ticket_price ? 'Get Tickets' : 'RSVP'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Video Ad Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Sponsored</h2>
              <VideoAd placement="detail" autoplay={false} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EventDetail;
