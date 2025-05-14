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
import { handleSupabaseError } from '@/lib/error-handler';
import { ArrowLeft, MapPin, Calendar, Tag, Clock, Users } from 'lucide-react';
import { fallbackEvents } from '@/data/fallback-data';
import { ShareButton } from '@/components/ui/share-button';
import { ReactionButton } from '@/components/ui/reaction-button';
import { toast } from 'sonner';
import { EnhancedImage } from '@/components/ui/enhanced-image';

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

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', parseInt(id || '0', 10))
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setEvent(data);

          // Track view
          await trackEventView(data.id);
        } else {
          // If no event found, use fallback
          const fallbackEvent = fallbackEvents.find(e => e.id.toString() === id);
          if (fallbackEvent) {
            setEvent(fallbackEvent);
          } else {
            throw new Error('Event not found');
          }
        }
      } catch (error) {
        handleSupabaseError(error, {
          title: 'Error loading event',
          message: 'Could not load event details. Using fallback data if available.',
          silent: true
        });

        // Try to use fallback data
        const fallbackEvent = fallbackEvents.find(e => e.id.toString() === id);
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

  const handleRegisterEvent = async () => {
    try {
      toast.success('Registration successful!', {
        description: 'You have successfully registered for this event.',
        icon: <Calendar className="h-5 w-5 text-green-500" />
      });

      // Track registration
      if (event?.id) {
        await supabase.from('analytics').insert({
          event_type: 'event_registration',
          event_source: 'event_page',
          source_id: event.id,
          metadata: { event_id: event.id }
        });
      }
    } catch (error) {
      console.error('Failed to track registration:', error);
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
                  <EnhancedImage
                    src={event.image_url}
                    alt={event.title}
                    aspectRatio="video"
                    objectFit="cover"
                    className="w-full h-full"
                    fallbackSrc="/images/placeholder-event.svg"
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
                        <Users className="h-4 w-4" />
                        {event.merchant_name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {event.featured && (
                      <Badge variant="outline" className="mb-2">Featured</Badge>
                    )}

                    {event.price && (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {event.price}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">{event.description}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-b py-4 mb-6">
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                    )}

                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <ReactionButton 
                      itemId={typeof event.id === 'string' ? parseInt(event.id, 10) : event.id} 
                      itemType="event"
                      animation="pop"
                      prominence="high"
                    />

                    {/* Share Button Component */}
                    <ShareButton
                      itemId={typeof event.id === 'string' ? parseInt(event.id, 10) : event.id}
                      itemType="event"
                      title={event.title}
                    />
                  </div>

                  <Button onClick={handleRegisterEvent} size="lg" className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-600 hover:to-pink-600">
                    Register for Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EventDetail;
