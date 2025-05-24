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
import { ReactionShare } from "@/components/ui/reaction-share";
import { format } from 'date-fns';

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

            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 md:h-96">
                <img
                  src={event?.image_url || '/placeholder-event.jpg'}
                  alt={event?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{event?.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event?.start_date || ''), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(event?.start_date || ''), 'p')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event?.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm">
                      {event?.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {event?.status}
                    </Badge>
                  </div>
                  <ReactionShare
                    itemId={event?.id || 0}
                    itemType="event"
                    initialReactions={{
                      likes: event?.likes_count || 0,
                      hearts: event?.hearts_count || 0,
                      comments: event?.comments_count || 0
                    }}
                  />
                </div>

                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-6">{event?.description}</p>
                  
                  {event?.highlights && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {event?.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event?.requirements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {event?.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" size="lg">
                    Register Now
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    Add to Calendar
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
