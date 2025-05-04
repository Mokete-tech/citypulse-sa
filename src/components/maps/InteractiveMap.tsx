import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Music, 
  Briefcase, 
  Palette, 
  Car, 
  Heart, 
  Calendar 
} from 'lucide-react';
import { toast } from 'sonner';

// Define map item types
export interface MapItem {
  id: number | string;
  type: 'deal' | 'event';
  title: string;
  description?: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  merchant: {
    id: number | string;
    name: string;
  };
  image_url?: string;
  discount?: string;
  price?: string;
  date?: string;
  distance?: number;
  isFavorite?: boolean;
}

interface InteractiveMapProps {
  items: MapItem[];
  userLocation?: { lat: number; lng: number } | null;
  onItemClick: (item: MapItem) => void;
  onViewportChange?: (bounds: { 
    north: number; 
    south: number; 
    east: number; 
    west: number 
  }) => void;
  height?: string;
  className?: string;
  showFilters?: boolean;
}

const InteractiveMap = ({
  items,
  userLocation,
  onItemClick,
  onViewportChange,
  height = '500px',
  className = '',
  showFilters = true
}: InteractiveMapProps) => {
  // Map container ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Map instance ref (will be set once map is loaded)
  const mapRef = useRef<any>(null);
  
  // Map markers ref (to keep track of markers)
  const markersRef = useRef<any[]>([]);
  
  // Selected item state
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [showDeals, setShowDeals] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  
  // Get all unique categories
  const allCategories = [...new Set(items.map(item => item.category))];
  
  // Initialize map on component mount
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps. Please try again later.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
      
      return () => {
        // Clean up script if component unmounts before script loads
        document.head.removeChild(script);
      };
    } else {
      // Google Maps API already loaded
      initializeMap();
    }
    
    // Initialize map function
    function initializeMap() {
      try {
        if (!mapContainerRef.current) return;
        
        // Create map instance
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: userLocation || { lat: -30.5595, lng: 22.9375 }, // Default to center of South Africa
          zoom: userLocation ? 13 : 6,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM
          }
        });
        
        // Store map instance in ref
        mapRef.current = map;
        
        // Add user location marker if available
        if (userLocation) {
          new window.google.maps.Marker({
            position: userLocation,
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#0EA5E9',
              fillOpacity: 0.4,
              strokeColor: '#0EA5E9',
              strokeWeight: 2
            },
            title: 'Your Location'
          });
          
          // Add accuracy circle
          new window.google.maps.Circle({
            map,
            center: userLocation,
            radius: 100, // 100m accuracy
            fillColor: '#0EA5E9',
            fillOpacity: 0.1,
            strokeColor: '#0EA5E9',
            strokeOpacity: 0.3,
            strokeWeight: 1
          });
        }
        
        // Listen for bounds change
        map.addListener('idle', () => {
          if (onViewportChange) {
            const bounds = map.getBounds();
            if (bounds) {
              onViewportChange({
                north: bounds.getNorthEast().lat(),
                south: bounds.getSouthWest().lat(),
                east: bounds.getNorthEast().lng(),
                west: bounds.getSouthWest().lng()
              });
            }
          }
        });
        
        // Set all categories as visible initially
        setVisibleCategories(allCategories);
        
        // Map is ready
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please try again later.');
        setIsLoading(false);
      }
    }
    
    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
    };
  }, [userLocation, onViewportChange, allCategories]);
  
  // Update markers when items, filters, or map changes
  useEffect(() => {
    if (!mapRef.current || isLoading) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = [];
    
    // Filter items based on current filters
    const filteredItems = items.filter(item => {
      if (item.type === 'deal' && !showDeals) return false;
      if (item.type === 'event' && !showEvents) return false;
      if (!visibleCategories.includes(item.category)) return false;
      return true;
    });
    
    // Create marker for each item
    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = new window.google.maps.InfoWindow();
    
    filteredItems.forEach(item => {
      // Skip items without valid coordinates
      if (!item.location || typeof item.location.lat !== 'number' || typeof item.location.lng !== 'number') {
        return;
      }
      
      // Get icon based on category
      const icon = getCategoryIcon(item.category, item.type);
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat: item.location.lat, lng: item.location.lng },
        map: mapRef.current,
        title: item.title,
        icon: {
          url: icon,
          scaledSize: new window.google.maps.Size(32, 32)
        },
        animation: window.google.maps.Animation.DROP
      });
      
      // Add click listener
      marker.addListener('click', () => {
        // Set selected item
        setSelectedItem(item);
        
        // Show info window
        infoWindow.setContent(`
          <div style="max-width: 200px; padding: 5px;">
            <h3 style="margin: 0 0 5px; font-weight: bold;">${item.title}</h3>
            <p style="margin: 0 0 5px; font-size: 12px;">${item.merchant.name}</p>
            ${item.type === 'deal' && item.discount ? 
              `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${item.discount}</span>` : ''}
            ${item.type === 'event' && item.date ? 
              `<p style="margin: 5px 0; font-size: 12px;">${item.date}</p>` : ''}
          </div>
        `);
        infoWindow.open(mapRef.current, marker);
      });
      
      // Add to markers ref
      markersRef.current.push(marker);
      
      // Extend bounds
      bounds.extend({ lat: item.location.lat, lng: item.location.lng });
    });
    
    // Add user location to bounds if available
    if (userLocation) {
      bounds.extend(userLocation);
    }
    
    // Fit map to bounds if we have markers
    if (markersRef.current.length > 0) {
      mapRef.current.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = mapRef.current.addListener('idle', () => {
        if (mapRef.current.getZoom() > 16) {
          mapRef.current.setZoom(16);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [items, showDeals, showEvents, visibleCategories, isLoading, userLocation]);
  
  // Get category icon URL
  const getCategoryIcon = (category: string, type: 'deal' | 'event') => {
    // This would normally return URLs to actual icons
    // For now, we'll return placeholder URLs based on category
    const baseColor = type === 'deal' ? '#0EA5E9' : '#EC4899';
    
    // In a real implementation, return actual icon URLs
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=${encodeURIComponent(baseColor)}&color=fff`;
  };
  
  // Get category icon component
  const getCategoryIconComponent = (category: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (category.toLowerCase()) {
      case 'food & drink':
        return <Utensils {...iconProps} />;
      case 'shopping':
        return <ShoppingBag {...iconProps} />;
      case 'entertainment':
        return <Music {...iconProps} />;
      case 'business':
        return <Briefcase {...iconProps} />;
      case 'arts':
        return <Palette {...iconProps} />;
      case 'services':
        return <Car {...iconProps} />;
      default:
        return <Coffee {...iconProps} />;
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };
  
  // Handle center on user
  const handleCenterOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(15);
    } else {
      toast.error('Unable to determine your location');
    }
  };
  
  // Toggle category visibility
  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Toggle item type visibility
  const toggleItemType = (type: 'deals' | 'events') => {
    if (type === 'deals') {
      setShowDeals(prev => !prev);
    } else {
      setShowEvents(prev => !prev);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4 flex flex-col items-center justify-center" style={{ height }}>
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
          <p className="text-muted-foreground text-center mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <CardContent className="p-0">
        {/* Map container */}
        <div ref={mapContainerRef} style={{ height }} />
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 shadow-md"
            onClick={handleZoomIn}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 shadow-md"
            onClick={handleZoomOut}
          >
            <Minus className="h-4 w-4" />
          </Button>
          {userLocation && (
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 shadow-md"
              onClick={handleCenterOnUser}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Map filters */}
        {showFilters && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 max-w-[200px]">
            <Card className="shadow-md">
              <CardContent className="p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Map Layers
                </h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge 
                    variant={showDeals ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItemType('deals')}
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Deals
                  </Badge>
                  <Badge 
                    variant={showEvents ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleItemType('events')}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Events
                  </Badge>
                </div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {allCategories.map(category => (
                    <Badge 
                      key={category}
                      variant={visibleCategories.includes(category) ? "outline" : "secondary"}
                      className={`cursor-pointer ${visibleCategories.includes(category) ? 'bg-gray-100' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => toggleCategory(category)}
                    >
                      {getCategoryIconComponent(category)}
                      <span className="ml-1">{category}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Selected item card */}
        {selectedItem && (
          <div className="absolute bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={selectedItem.type === 'deal' ? 'default' : 'secondary'} className="mb-2">
                      {selectedItem.type === 'deal' ? 'Deal' : 'Event'}
                    </Badge>
                    <h3 className="font-semibold text-lg">{selectedItem.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.merchant.name}</p>
                    
                    {selectedItem.type === 'deal' && selectedItem.discount && (
                      <Badge variant="outline" className="mt-2">{selectedItem.discount}</Badge>
                    )}
                    
                    {selectedItem.type === 'event' && selectedItem.date && (
                      <p className="text-sm mt-2">{selectedItem.date}</p>
                    )}
                    
                    {selectedItem.distance !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {selectedItem.distance.toFixed(1)} km away
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500"
                    onClick={() => {
                      // Toggle favorite status
                      // This would normally update in your database
                      toast.success(`${selectedItem.isFavorite ? 'Removed from' : 'Added to'} favorites`);
                    }}
                  >
                    <Heart className={`h-5 w-5 ${selectedItem.isFavorite ? 'fill-red-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Open in Google Maps
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedItem.location.lat},${selectedItem.location.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => onItemClick(selectedItem)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
