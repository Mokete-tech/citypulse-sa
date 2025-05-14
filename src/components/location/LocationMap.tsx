import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Coordinates } from '@/lib/geo-utils';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  coordinates: Coordinates | null;
  items?: Array<{
    id: number;
    title: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
    type: 'deal' | 'event';
  }>;
  height?: string;
  className?: string;
  onItemClick?: (id: number, type: 'deal' | 'event') => void;
  zoom?: number;
  showUserLocation?: boolean;
}

export function LocationMap({
  coordinates,
  items = [],
  height = '300px',
  className,
  onItemClick,
  zoom = 12,
  showUserLocation = true
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null);

  // Initialize map when coordinates are available
  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        
        // Check if Google Maps API is loaded
        if (!window.google || !window.google.maps) {
          // Create a script element to load Google Maps API
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzwk17mcLxJxX7hcCI&libraries=places`;
          script.async = true;
          script.defer = true;
          
          // Wait for the script to load
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));
            document.head.appendChild(script);
          });
        }
        
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { 
            lat: coordinates.latitude, 
            lng: coordinates.longitude 
          },
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
        
        setMapInstance(map);
        
        // Add user location marker if enabled
        if (showUserLocation) {
          const userMarker = new window.google.maps.Marker({
            position: { 
              lat: coordinates.latitude, 
              lng: coordinates.longitude 
            },
            map: map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4f46e5',
              fillOpacity: 0.7,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            title: 'Your Location'
          });
          
          setUserMarker(userMarker);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      if (mapInstance) {
        // Clean up markers
        markers.forEach(marker => marker.setMap(null));
        if (userMarker) userMarker.setMap(null);
      }
    };
  }, [coordinates]);
  
  // Add markers for items when map is ready
  useEffect(() => {
    if (!mapInstance || !items.length) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create new markers
    const newMarkers = items.map(item => {
      // Skip items without coordinates
      if (!item.latitude || !item.longitude) return null;
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat: item.latitude, lng: item.longitude },
        map: mapInstance,
        title: item.title,
        icon: {
          url: item.type === 'deal' 
            ? '/images/marker-deal.svg' 
            : '/images/marker-event.svg',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        animation: window.google.maps.Animation.DROP
      });
      
      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">${item.title}</h3>
            <p style="margin: 0; color: #666;">
              ${item.distance ? `${item.distance.toFixed(1)} km away` : ''}
            </p>
            <button 
              id="view-${item.id}-${item.type}" 
              style="
                margin-top: 8px; 
                padding: 4px 8px; 
                background: #4f46e5; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
              "
            >
              View Details
            </button>
          </div>
        `
      });
      
      // Add click listener to marker
      marker.addListener('click', () => {
        // Close all other info windows
        markers.forEach(m => {
          if (m && m.infoWindow) {
            m.infoWindow.close();
          }
        });
        
        // Open this info window
        infoWindow.open(mapInstance, marker);
        
        // Add click listener to view button after info window is opened
        window.google.maps.event.addListener(infoWindow, 'domready', () => {
          const button = document.getElementById(`view-${item.id}-${item.type}`);
          if (button) {
            button.addEventListener('click', () => {
              if (onItemClick) {
                onItemClick(item.id, item.type);
              }
            });
          }
        });
      });
      
      // Store info window reference on marker
      marker.infoWindow = infoWindow;
      
      return marker;
    }).filter(Boolean);
    
    setMarkers(newMarkers);
    
    // Fit bounds to include all markers if there are multiple
    if (newMarkers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add user location to bounds if available
      if (coordinates && showUserLocation) {
        bounds.extend({ 
          lat: coordinates.latitude, 
          lng: coordinates.longitude 
        });
      }
      
      // Add all markers to bounds
      newMarkers.forEach(marker => {
        if (marker) bounds.extend(marker.getPosition());
      });
      
      // Fit map to bounds with padding
      mapInstance.fitBounds(bounds, 50);
    }
  }, [mapInstance, items, onItemClick]);
  
  // Center map on user location
  const centerOnUser = () => {
    if (!mapInstance || !coordinates) return;
    
    mapInstance.panTo({ 
      lat: coordinates.latitude, 
      lng: coordinates.longitude 
    });
    mapInstance.setZoom(zoom);
  };

  return (
    <div className={cn('relative rounded-md overflow-hidden', className)}>
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full bg-muted" 
        style={{ height }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="max-w-xs p-4 text-center">
            <MapPin className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive font-medium mb-2">{mapError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      
      {/* Center on user button */}
      {!isLoading && !mapError && coordinates && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 shadow-md"
          onClick={centerOnUser}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default LocationMap;
