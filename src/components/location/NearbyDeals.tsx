import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DealCard } from '@/components/cards/DealCard';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { MapPin, AlertCircle, Map } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fallbackDeals } from '@/data/fallback-data';
import { toast } from 'sonner';
import { filterItemsByDistance } from '@/lib/geo-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationMap from './LocationMap';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Deal {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount?: number;
  location?: string;
  city?: string;
  date?: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
}

interface NearbyDealsProps {
  initialRadius?: number;
  maxDeals?: number;
  className?: string;
}

const NearbyDeals = ({
  initialRadius = 10,
  maxDeals = 3,
  className = '',
}: NearbyDealsProps) => {
  const [radius, setRadius] = useState(initialRadius);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Get user's location
  useEffect(() => {
    let locationTimeout: NodeJS.Timeout;
    
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

      locationTimeout = setTimeout(() => {
        // If geolocation takes too long, use default location
        if (!coordinates) {
          setLocationError('Location request timed out. Using default location.');
          useDefaultLocation();
        }
      }, 6000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission('granted');
          setLoading(false);
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.error('Geolocation error:', error);
          setLocationError(`Location access denied: ${error.message}`);
          setLocationPermission('denied');
          useDefaultLocation();
        },
        options
      );
    };

    getUserLocation();

    return () => {
      if (locationTimeout) {
        clearTimeout(locationTimeout);
      }
    };
  }, []);

  // Fetch nearby deals when coordinates or radius changes
  useEffect(() => {
    const fetchNearbyDeals = async () => {
      if (!coordinates) return;

      setLoading(true);
      setError(null);

      try {
        // In a real implementation, you would use a geospatial query
        // For now, we'll simulate by fetching all deals and filtering client-side
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Simulate filtering by distance
        // In a real app, this would be done on the server with a geospatial query
        const nearbyDeals = data
          ? filterDealsByDistance(data, coordinates, radius)
          : [];

        setDeals(nearbyDeals.slice(0, maxDeals));
      } catch (error) {
        handleSupabaseError(error, {
          title: 'Error loading nearby deals',
          message: 'Could not load nearby deals. Using fallback data instead.',
        });

        // Use fallback data
        const nearbyFallbackDeals = filterDealsByDistance(fallbackDeals, coordinates, radius);
        setDeals(nearbyFallbackDeals.slice(0, maxDeals));
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDeals();
  }, [coordinates, radius, maxDeals]);

  // Use the Haversine formula to calculate actual distances
  const filterDealsByDistance = (deals: any[], coords: Coordinates, radiusKm: number) => {
    return filterItemsByDistance(deals, coords, radiusKm);
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
          description: 'Now showing deals near your location'
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

  const handleDealClick = (id: number) => {
    window.location.href = `/deals/${id}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Deals
        </CardTitle>
        <CardDescription>
          Discover deals close to your current location
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
        ) : loading && !deals.length ? (
          <LoadingState isLoading={true} type="card" count={maxDeals} />
        ) : deals.length > 0 ? (
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Distance: {radius} km</span>
                <span className="text-sm text-muted-foreground">
                  {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found
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

            <TabsContent value="list" className="space-y-4 mt-0">
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="relative">
                    <DealCard
                      id={deal.id}
                      title={deal.title}
                      description={deal.description}
                      merchant_name={deal.merchant_name}
                      category={deal.category}
                      expiration_date={deal.expiration_date}
                      discount={deal.discount}
                      image_url={deal.image_url}
                      featured={deal.featured}
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {deal.distance?.toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <LocationMap
                coordinates={coordinates}
                items={deals.map(deal => ({
                  id: deal.id,
                  title: deal.title,
                  latitude: deal.latitude,
                  longitude: deal.longitude,
                  distance: deal.distance,
                  type: 'deal'
                }))}
                height="300px"
                onItemClick={(id) => handleDealClick(id)}
                className="mb-4"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">No deals found within {radius} km</p>
            <Button
              variant="outline"
              className="w-full"
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

export default NearbyDeals;
