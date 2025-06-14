
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  country?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      toast({
        title: "Location Error",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city/province info
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationData: LocationData = {
              latitude,
              longitude,
              city: data.city || data.locality,
              province: data.principalSubdivision,
              country: data.countryName
            };
            
            setLocation(locationData);
            localStorage.setItem('user-location', JSON.stringify(locationData));
            
            toast({
              title: "Location Found!",
              description: `${locationData.city}, ${locationData.province}`,
            });
          } else {
            // Fallback: just use coordinates
            const locationData: LocationData = { latitude, longitude };
            setLocation(locationData);
            localStorage.setItem('user-location', JSON.stringify(locationData));
          }
        } catch (err) {
          console.error('Geocoding error:', err);
          const locationData: LocationData = { latitude, longitude };
          setLocation(locationData);
          localStorage.setItem('user-location', JSON.stringify(locationData));
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(error.message);
        setIsLoading(false);
        
        toast({
          title: "Location Access Denied",
          description: "Please enable location access or set your location manually",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const setManualLocation = (city: string, province: string) => {
    // For manual location, we'll use approximate coordinates for major SA cities
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'cape town': { lat: -33.9249, lng: 18.4241 },
      'johannesburg': { lat: -26.2041, lng: 28.0473 },
      'durban': { lat: -29.8587, lng: 31.0218 },
      'pretoria': { lat: -25.7479, lng: 28.2293 },
      'port elizabeth': { lat: -33.9608, lng: 25.6022 },
      'bloemfontein': { lat: -29.0852, lng: 26.1596 },
      'east london': { lat: -33.0153, lng: 27.9116 },
      'pietermaritzburg': { lat: -29.6144, lng: 30.3933 }
    };

    const coords = cityCoordinates[city.toLowerCase()] || cityCoordinates['cape town'];
    
    const locationData: LocationData = {
      latitude: coords.lat,
      longitude: coords.lng,
      city,
      province,
      country: 'South Africa'
    };
    
    setLocation(locationData);
    localStorage.setItem('user-location', JSON.stringify(locationData));
    
    toast({
      title: "Location Set",
      description: `${city}, ${province}`,
    });
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem('user-location');
    setError(null);
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('user-location');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (err) {
        console.error('Error parsing saved location:', err);
        localStorage.removeItem('user-location');
      }
    }
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    setManualLocation,
    clearLocation
  };
};
