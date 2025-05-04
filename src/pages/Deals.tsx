
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { DealCard } from '@/components/cards/DealCard';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { Search, Tag, MapPin, List } from 'lucide-react';
import { fallbackDeals } from '@/data/fallback-data';
import FilterBar, { FilterOptions } from '@/components/filters/FilterBar';
import DealMap, { MapItem } from '@/components/maps/DealMap';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/hooks/usePreferences';
import SEO from '@/components/seo/SEO';

const Deals = () => {
  const { preferences } = usePreferences();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: preferences.categories,
    priceRange: preferences.priceRange,
    discountRange: [0, 100],
    distanceRange: preferences.maxDistance,
    sortBy: 'newest',
    merchants: [],
  });

  // Get available categories and merchants for filters
  const availableCategories = [...new Set(deals.map(deal => deal.category))];
  const availableMerchants = [...new Set(deals.map(deal => deal.merchant_name))];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDeals(data || fallbackDeals);
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading deals',
        message: 'Could not load deals. Using fallback data instead.',
        silent: true
      });
      setError('Failed to load deals. Showing sample data instead.');
      setDeals(fallbackDeals);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Add distance to deals if user location is available
  const dealsWithDistance = deals.map(deal => {
    if (userLocation && deal.location_lat && deal.location_lng) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        deal.location_lat,
        deal.location_lng
      );
      return { ...deal, distance };
    }
    return deal;
  });

  // Filter deals based on search query and filters
  const filteredDeals = dealsWithDistance.filter(deal => {
    // Search query filter
    const matchesSearch =
      !searchQuery ||
      deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.merchant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(deal.category)) {
      return false;
    }

    // Merchant filter
    if (filters.merchants.length > 0 && !filters.merchants.includes(deal.merchant_name)) {
      return false;
    }

    // Price filter
    if (deal.price && (deal.price < filters.priceRange[0] || deal.price > filters.priceRange[1])) {
      return false;
    }

    // Distance filter
    if (deal.distance && deal.distance > filters.distanceRange) {
      return false;
    }

    return true;
  });

  // Sort filtered deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (filters.sortBy) {
      case 'distance':
        return (a.distance || 999) - (b.distance || 999);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'discount':
        // Extract discount percentage from discount string (e.g., "20% Off" -> 20)
        const getDiscountPercent = (deal: any) => {
          const match = deal.discount?.match(/(\d+)%/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getDiscountPercent(b) - getDiscountPercent(a);
      case 'popular':
        return (b.reactions || 0) - (a.reactions || 0);
      default: // newest
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  // Convert deals to map items
  const mapItems: MapItem[] = sortedDeals.map(deal => ({
    id: deal.id,
    type: 'deal',
    title: deal.title,
    description: deal.description,
    category: deal.category,
    location: {
      lat: deal.location_lat || -33.918861,
      lng: deal.location_lng || 18.423300,
      address: deal.location_address
    },
    merchant: {
      id: deal.merchant_id || '1',
      name: deal.merchant_name
    },
    image_url: deal.image_url,
    discount: deal.discount,
    price: deal.price,
    distance: deal.distance,
    isFavorite: false // This would be set based on user preferences
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <SEO
        title="Local Deals | CityPulse South Africa"
        description="Explore the best local deals across South Africa. Find discounts, offers, and promotions from your favorite merchants."
      />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Local Deals</h1>
            <p className="text-muted-foreground">
              Explore all the best deals across South Africa.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deals by name, location, or category..."
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Map
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter sidebar */}
            <div className="lg:col-span-1">
              <FilterBar
                type="deals"
                availableCategories={availableCategories}
                availableMerchants={availableMerchants}
                onFilterChange={setFilters}
                className="sticky top-4"
              />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              <LoadingState isLoading={loading} type="card" count={6}>
                {error && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6">
                    {error}
                  </div>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                  <DealMap
                    items={mapItems}
                    userLocation={userLocation}
                    height="600px"
                    className="mb-6"
                  />
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedDeals.map(deal => (
                      <DealCard
                        key={deal.id}
                        id={deal.id}
                        title={deal.title}
                        description={deal.description}
                        merchant_name={deal.merchant_name}
                        category={deal.category}
                        expiration_date={deal.expiration_date}
                        discount={deal.discount}
                        image_url={deal.image_url}
                        featured={deal.featured}
                        distance={deal.distance}
                      />
                    ))}
                  </div>
                )}
              </LoadingState>

              {sortedDeals.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center mt-12 text-center">
                  <Tag className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-medium mb-2">No deals found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        categories: [],
                        priceRange: [0, 1000],
                        discountRange: [0, 100],
                        distanceRange: 10,
                        sortBy: 'newest',
                        merchants: [],
                      });
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Deals;
