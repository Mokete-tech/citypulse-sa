import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { EventCard } from '@/components/cards/EventCard';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fallbackEvents } from '@/data/fallback-data';
import { toast } from 'sonner';

interface NearbyEventsProps {
  initialRadius?: number;
  maxEvents?: number;
  className?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const NearbyEvents = ({
  initialRadius = 10,
  maxEvents = 3,
  className = '',
}: NearbyEventsProps) => {
  const [radius, setRadius] = useState(initialRadius);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission('granted');
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(
            error.code === error.PERMISSION_DENIED
              ? 'Location permission denied. Please enable location services to see nearby events.'
              : 'Unable to retrieve your location'
          );
          setLocationPermission('denied');
          setLoading(false);
        }
      );
    };

    getUserLocation();
  }, []);

  // Fetch nearby events when coordinates or radius changes
  useEffect(() => {
    const fetchNearbyEvents = async () => {
      if (!coordinates) return;

      setLoading(true);
      setError(null);

      try {
        // In a real implementation, you would use a geospatial query
        // For now, we'll simulate by fetching all events and filtering client-side
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        // Simulate filtering by distance
        // In a real app, this would be done on the server with a geospatial query
        const nearbyEvents = data
          ? filterEventsByDistance(data, coordinates, radius)
          : [];

        setEvents(nearbyEvents.slice(0, maxEvents));
      } catch (error) {
        handleSupabaseError(error, {
          title: 'Error loading nearby events',
          message: 'Could not load nearby events. Using fallback data instead.',
        });
        
        // Use fallback data
        const nearbyFallbackEvents = filterEventsByDistance(fallbackEvents, coordinates, radius);
        setEvents(nearbyFallbackEvents.slice(0, maxEvents));
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyEvents();
  }, [coordinates, radius, maxEvents]);

  // Simulate distance calculation
  // In a real app, you would use the Haversine formula or a geospatial database
  const filterEventsByDistance = (events: any[], coords: Coordinates, radiusKm: number) => {
    // For demo purposes, we'll randomly assign distances to events
    return events.map(event => ({
      ...event,
      distance: Math.random() * radiusKm // Random distance within the radius
    })).filter(event => event.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  };

  const handleRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPermission('granted');
        setLocationError(null);
        toast.success('Location access granted');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Location permission denied');
        setLocationPermission('denied');
        toast.error('Location access denied');
      }
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Events
        </CardTitle>
        <CardDescription>
          Discover events happening close to you
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {locationError ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
            
            {locationPermission === 'denied' && (
              <Button onClick={handleRequestLocation} className="w-full">
                Enable Location
              </Button>
            )}
          </div>
        ) : loading && !events.length ? (
          <LoadingState isLoading={true} type="card" count={maxEvents} />
        ) : events.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Distance: {radius} km</span>
                <span className="text-sm text-muted-foreground">
                  {events.length} {events.length === 1 ? 'event' : 'events'} found
                </span>
              </div>
              <Slider
                value={[radius]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setRadius(value[0])}
              />
            </div>
            
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    merchant_name={event.merchant_name}
                    category={event.category}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    price={event.price}
                    image_url={event.image_url}
                    featured={event.featured}
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {event.distance.toFixed(1)} km
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => setRadius(Math.min(radius + 10, 50))}>
              Show More Events
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found within {radius} km</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setRadius(Math.min(radius + 10, 50))}
            >
              Increase Search Radius
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyEvents;
