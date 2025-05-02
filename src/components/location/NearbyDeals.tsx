import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DealCard } from '@/components/cards/DealCard';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NearbyDealsProps {
  initialRadius?: number;
  maxDeals?: number;
}

export function NearbyDeals({ initialRadius = 5, maxDeals = 6 }: NearbyDealsProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(initialRadius);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const navigate = useNavigate();

  // Request location permission and get user's location
  const requestLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermission('granted');
        localStorage.setItem('locationPermission', 'granted');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
        localStorage.setItem('locationPermission', 'denied');
        toast.error('Unable to get your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  // Check if location permission was previously granted
  useEffect(() => {
    const savedPermission = localStorage.getItem('locationPermission');
    if (savedPermission) {
      setLocationPermission(savedPermission as 'granted' | 'denied' | 'prompt');
      
      if (savedPermission === 'granted') {
        requestLocation();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch nearby deals when user location or radius changes
  useEffect(() => {
    const fetchNearbyDeals = async () => {
      if (!userLocation) return;
      
      setLoading(true);
      
      try {
        // Call the Supabase function to get nearby deals
        const { data, error } = await supabase.rpc('get_nearby_deals', {
          user_lat: userLocation.lat,
          user_lng: userLocation.lng,
          radius_km: radius
        });
        
        if (error) {
          console.error('Error fetching nearby deals:', error);
          toast.error('Failed to load nearby deals');
          setDeals([]);
        } else {
          setDeals(data || []);
        }
      } catch (error) {
        console.error('Error in nearby deals fetch:', error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userLocation) {
      fetchNearbyDeals();
    }
  }, [userLocation, radius]);

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
  };

  // Handle view all click
  const handleViewAll = () => {
    navigate('/deals?nearby=true');
  };

  // If location permission hasn't been granted yet
  if (locationPermission !== 'granted' && !loading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <MapPin className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Discover Deals Near You</h3>
          <p className="text-muted-foreground">
            Allow location access to see deals and events in your area.
          </p>
          <Button onClick={requestLocation} className="mt-2">
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Deals Near You
          </h2>
          {deals.length > maxDeals && (
            <Button variant="link" onClick={handleViewAll}>
              View All
            </Button>
          )}
        </div>
        
        {userLocation && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground min-w-[60px]">
              {radius} km
            </span>
            <Slider
              value={[radius]}
              min={1}
              max={20}
              step={1}
              onValueChange={handleRadiusChange}
              className="flex-1"
            />
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Finding deals near you...</span>
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, maxDeals).map(deal => (
            <DealCard 
              key={deal.id} 
              {...deal} 
              distance={`${deal.distance.toFixed(1)} km away`}
              onClick={() => navigate(`/deals/${deal.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No deals found nearby</h3>
          <p className="mt-2 text-muted-foreground">
            Try increasing the search radius or check back later for new deals in your area.
          </p>
          {radius < 20 && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setRadius(Math.min(radius + 5, 20))}
            >
              Increase Radius to {Math.min(radius + 5, 20)} km
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
