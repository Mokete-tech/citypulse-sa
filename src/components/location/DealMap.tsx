import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { MapPin, AlertCircle, Map as MapIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fallbackDeals } from '@/data/fallback-data';
import { toast } from 'sonner';

interface DealMapProps {
  className?: string;
  maxDeals?: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Deal {
  id: number;
  title: string;
  description: string;
  merchant_name: string;
  category: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  image_url?: string;
}

const DealMap = ({ className = '', maxDeals = 10 }: DealMapProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      // Set options for geolocation request
      const options = {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 10000,            // Time to wait for a position
        maximumAge: 300000         // Accept positions up to 5 minutes old
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
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
          console.error('Error getting location:', error);

          // Provide more specific error messages based on the error code
          let errorMessage = 'Unable to retrieve your location';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services to see nearby deals.';
              setLocationPermission('denied');
              localStorage.setItem('locationPermission', 'denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again later.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }

          setLocationError(errorMessage);
          setLoading(false);
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
      setLocationError('Location permission was previously denied. Please enable location services to see nearby deals.');
      setLoading(false);
    }

    getUserLocation();
  }, []);

  // Calculate distance using the Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Earth's radius in kilometers
    const R = 6371;
    
    // Convert latitude and longitude from degrees to radians
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    // Haversine formula
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  };

  // Fetch nearby deals when coordinates change
  useEffect(() => {
    const fetchNearbyDeals = async () => {
      if (!coordinates) return;

      setLoading(true);

      try {
        // In a real implementation, you would use a geospatial query
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process deals with coordinates
        const dealsWithDistance = (data || fallbackDeals).map(deal => {
          // If the deal has coordinates, calculate the actual distance
          if (deal.latitude && deal.longitude && coordinates) {
            const distance = calculateDistance(
              coordinates.latitude, 
              coordinates.longitude, 
              deal.latitude, 
              deal.longitude
            );
            return { ...deal, distance };
          }
          
          // Fallback to random coordinates for demo purposes
          const randomLat = coordinates.latitude + (Math.random() - 0.5) * 0.1;
          const randomLng = coordinates.longitude + (Math.random() - 0.5) * 0.1;
          const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            randomLat,
            randomLng
          );
          
          return {
            ...deal,
            latitude: randomLat,
            longitude: randomLng,
            distance
          };
        });

        // Sort by distance and limit to maxDeals
        const nearbyDeals = dealsWithDistance
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, maxDeals);

        setDeals(nearbyDeals);
      } catch (error) {
        handleSupabaseError(error, {
          title: 'Error loading nearby deals',
          message: 'Could not load nearby deals. Using fallback data instead.',
        });

        // Use fallback data with random coordinates
        const fallbackWithCoords = fallbackDeals.map(deal => {
          const randomLat = coordinates.latitude + (Math.random() - 0.5) * 0.1;
          const randomLng = coordinates.longitude + (Math.random() - 0.5) * 0.1;
          const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            randomLat,
            randomLng
          );
          
          return {
            ...deal,
            latitude: randomLat,
            longitude: randomLng,
            distance
          };
        });

        setDeals(fallbackWithCoords.slice(0, maxDeals));
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDeals();
  }, [coordinates, maxDeals]);

  // Initialize and update map when coordinates or deals change
  useEffect(() => {
    const initMap = async () => {
      if (!coordinates || !mapRef.current) return;

      // Check if the Google Maps script is already loaded
      if (!window.google || !window.google.maps) {
        // This is a simplified approach. In a real app, you would use a proper script loader
        // or a React library like @react-google-maps/api
        console.log('Google Maps not loaded. In a real app, we would load the script here.');
        return;
      }

      // Create map instance if it doesn't exist
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: coordinates.latitude, lng: coordinates.longitude },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        // Add user marker
        new window.google.maps.Marker({
          position: { lat: coordinates.latitude, lng: coordinates.longitude },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      }

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each deal
      deals.forEach(deal => {
        if (deal.latitude && deal.longitude) {
          const marker = new window.google.maps.Marker({
            position: { lat: deal.latitude, lng: deal.longitude },
            map: mapInstanceRef.current,
            title: deal.title,
            animation: window.google.maps.Animation.DROP
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="margin: 0 0 5px; font-size: 16px;">${deal.title}</h3>
                <p style="margin: 0 0 5px; font-size: 12px;">${deal.merchant_name}</p>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${deal.distance ? deal.distance.toFixed(1) + ' km away' : ''}
                </p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });

          markersRef.current.push(marker);
        }
      });
    };

    // In a real app, we would load the Google Maps script here if needed
    // For this demo, we'll just simulate the map initialization
    if (coordinates && deals.length > 0) {
      // Simulate map initialization after a short delay
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #666; text-align: center; padding: 20px;">
                <div>
                  <div style="margin-bottom: 10px; font-size: 24px;">🗺️</div>
                  <p>Map would display here with ${deals.length} nearby deals</p>
                  <p style="font-size: 12px; margin-top: 10px;">Your location: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}</p>
                </div>
              </div>
            </div>
          `;
        }
      }, 500);
    }
  }, [coordinates, deals]);

  const handleRequestLocation = () => {
    setLoading(true);
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Deals Near You
        </CardTitle>
        <CardDescription>
          View deals on the map around your location
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
        ) : loading ? (
          <LoadingState isLoading={true} type="card" count={1} />
        ) : (
          <div className="space-y-4">
            <div 
              ref={mapRef} 
              className="w-full h-[300px] bg-gray-100 rounded-md overflow-hidden"
              aria-label="Map showing nearby deals"
            />
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                <MapPin className="h-4 w-4 inline mr-1" />
                Your location
              </span>
              <span>
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found nearby
              </span>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/deals'}>
              View All Deals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealMap;
