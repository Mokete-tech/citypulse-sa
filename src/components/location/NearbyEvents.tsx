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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      // Use default coordinates for Johannesburg if geolocation is not available
      const useDefaultLocation = () => {
        console.log('Using default location (Johannesburg)');
        // Johannesburg coordinates
        setCoordinates({
          latitude: -26.2041,
          longitude: 28.0473,
        });
        setLoading(false);
      };

      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser. Using default location.');
        useDefaultLocation();
        return;
      }

      // Set options for geolocation request
      const options = {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 5000,             // Reduced timeout to 5 seconds for better UX
        maximumAge: 300000         // Accept positions up to 5 minutes old
      };

      const locationTimeout = setTimeout(() => {
        // If geolocation takes too long, use default location
        if (!coordinates) {
          setLocationError('Location request timed out. Using default location.');
          useDefaultLocation();
        }
      }, 6000); // Slightly longer than the geolocation timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission('granted');
          setLocationError(null);

          // Store location permission in localStorage for future reference
          localStorage.setItem('locationPermission', 'granted');
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.error('Error getting location:', error);

          // Provide more specific error messages based on the error code
          let errorMessage = 'Unable to retrieve your location. Using default location.';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Using default location.';
              setLocationPermission('denied');
              localStorage.setItem('locationPermission', 'denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Using default location.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Using default location.';
              break;
          }

          setLocationError(errorMessage);
          useDefaultLocation();
        },
        options
      );
    };

    // Check if we have a stored permission first
    const storedPermission = localStorage.getItem('locationPermission');
    if (storedPermission === 'granted') {
      setLocationPermission('granted');
    } else if (storedPermission === 'denied') {
      setLocationPermission('denied');
      setLocationError('Location permission was previously denied. Using default location.');
      // Use default location for Johannesburg
      setCoordinates({
        latitude: -26.2041,
        longitude: 28.0473,
      });
      setLoading(false);
    } else {
      getUserLocation();
    }
  }, [coordinates]);

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
  const filterEventsByDistance = (events: any[], _coords: Coordinates, radiusKm: number) => {
    // For demo purposes, we'll randomly assign distances to events
    return events.map(event => ({
      ...event,
      distance: Math.random() * radiusKm // Random distance within the radius
    })).filter(event => event.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  };

  const handleRequestLocation = () => {
    setLoading(true);

    // Clear any previous errors
    setLocationError(null);

    // Set options for geolocation request
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0 // Force fresh location
    };

    // Show a toast to guide the user
    toast.info('Requesting location access...', {
      description: 'Please allow access when prompted by your browser'
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPermission('granted');
        setLocationError(null);
        localStorage.setItem('locationPermission', 'granted');
        toast.success('Location access granted', {
          description: 'Now showing events near your location'
        });
      },
      (error) => {
        console.error('Error getting location:', error);

        // Provide more specific error messages based on the error code
        let errorMessage = 'Unable to retrieve your location';
        let toastMessage = 'Location access failed';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please check your browser settings and try again.';
            toastMessage = 'Location access denied';
            setLocationPermission('denied');
            localStorage.setItem('locationPermission', 'denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again later.';
            toastMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            toastMessage = 'Location request timed out';
            break;
        }

        setLocationError(errorMessage);
        setLoading(false);
        toast.error(toastMessage, {
          description: errorMessage
        });
      },
      options
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
