import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DealCard } from '@/components/cards/DealCard';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fallbackDeals } from '@/data/fallback-data';
import { toast } from 'sonner';

interface NearbyDealsProps {
  initialRadius?: number;
  maxDeals?: number;
  className?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const NearbyDeals = ({
  initialRadius = 10,
  maxDeals = 3,
  className = '',
}: NearbyDealsProps) => {
  const [radius, setRadius] = useState(initialRadius);
  const [deals, setDeals] = useState<any[]>([]);
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
              ? 'Location permission denied. Please enable location services to see nearby deals.'
              : 'Unable to retrieve your location'
          );
          setLocationPermission('denied');
          setLoading(false);
        }
      );
    };

    getUserLocation();
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

  // Simulate distance calculation
  // In a real app, you would use the Haversine formula or a geospatial database
  const filterDealsByDistance = (deals: any[], coords: Coordinates, radiusKm: number) => {
    // For demo purposes, we'll randomly assign distances to deals
    return deals.map(deal => ({
      ...deal,
      distance: Math.random() * radiusKm // Random distance within the radius
    })).filter(deal => deal.distance <= radiusKm)
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
          <div className="space-y-6">
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
                    {deal.distance.toFixed(1)} km
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => setRadius(Math.min(radius + 10, 50))}>
              Show More Deals
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No deals found within {radius} km</p>
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

export default NearbyDeals;
