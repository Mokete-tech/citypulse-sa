
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DealCard } from '@/components/cards/DealCard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnvWarning } from '@/components/ui/env-warning';
import { LoadingState } from '@/components/ui/loading-state';
import { fallbackDeals } from '@/data/fallback-data';
import { Search, MapPin, Tag, ArrowDown, Sliders } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CITIES = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Kimberley',
  'Polokwane',
  'Nelspruit'
];

const CATEGORIES = [
  'Food & Dining',
  'Entertainment',
  'Beauty & Wellness',
  'Shopping',
  'Travel',
  'Activities',
  'Services',
  'Technology',
  'Other'
];

const DealsPage = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all-cities');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all-categories');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      
      // Build Supabase query
      let query = supabase.from('deals').select('*');
      
      // Apply filters from URL if present
      if (searchParams.get('q')) {
        query = query.ilike('title', `%${searchParams.get('q')}%`);
      }
      
      if (searchParams.get('city') && searchParams.get('city') !== 'all-cities') {
        query = query.eq('city', searchParams.get('city'));
      }
      
      if (searchParams.get('category') && searchParams.get('category') !== 'all-categories') {
        query = query.eq('category', searchParams.get('category'));
      }
      
      if (searchParams.get('featured') === 'true') {
        query = query.eq('featured', true);
      }
      
      // Sort the results
      const sortParam = searchParams.get('sort') || 'newest';
      switch (sortParam) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('views', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching deals:', error);
        // Use fallback data
        setDeals(fallbackDeals);
      } else {
        setDeals(data.length > 0 ? data : fallbackDeals);
      }
    } catch (error) {
      console.error('Error:', error);
      // Use fallback data
      setDeals(fallbackDeals);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCity && selectedCity !== 'all-cities') params.set('city', selectedCity);
    if (selectedCategory && selectedCategory !== 'all-categories') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    if (featuredOnly) params.set('featured', 'true');
    
    setSearchParams(params);
    fetchDeals();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all-cities');
    setSelectedCategory('all-categories');
    setSortBy('newest');
    setPriceRange([0, 1000]);
    setFeaturedOnly(false);
    setSearchParams({});
    fetchDeals();
  };

  const handleDealClick = async (dealId: number) => {
    try {
      // Track click analytics
      await supabase.from('analytics').insert({
        event_type: 'deal_click',
        event_source: 'deals_page',
        source_id: dealId,
        metadata: { deal_id: dealId }
      });
      
      // Update view count
      const { data: dealData, error: fetchError } = await supabase
        .from('deals')
        .select('views')
        .eq('id', dealId)
        .single();
        
      if (!fetchError) {
        const currentViews = dealData?.views || 0;
        await supabase
          .from('deals')
          .update({ views: currentViews + 1 })
          .eq('id', dealId);
      }
      
      // Navigate to deal detail page
      window.location.href = `/deals/${dealId}`;
    } catch (error) {
      console.error('Failed to track deal click:', error);
      // Still navigate even if tracking fails
      window.location.href = `/deals/${dealId}`;
    }
  };

  return (
    <ResponsiveLayout title="Explore Deals" description="Discover the best deals across South Africa">
      <EnvWarning />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filters sidebar - desktop */}
        <div className={`lg:col-span-1 space-y-6 ${isMobile ? 'hidden' : 'block'}`}>
          <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
            <h3 className="font-medium text-lg mb-4">Filters</h3>
            
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="city">Location</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cities</SelectLabel>
                      <SelectItem value="all-cities">All Cities</SelectItem>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="newest" />
                    <Label htmlFor="newest">Newest First</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_low" id="price_low" />
                    <Label htmlFor="price_low">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_high" id="price_high" />
                    <Label htmlFor="price_high">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="popularity" id="popularity" />
                    <Label htmlFor="popularity">Popularity</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Price Range</Label>
                  <div className="pt-2 pb-6">
                    <Slider 
                      defaultValue={[priceRange[0], priceRange[1]]} 
                      max={1000} 
                      step={1}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="featuredOnly" 
                    checked={featuredOnly}
                    onCheckedChange={(checked) => setFeaturedOnly(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="featuredOnly">Featured Deals Only</Label>
                    <p className="text-sm text-muted-foreground">Show only featured deals</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <Button type="submit" className="w-full">Apply Filters</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search deals..."
                  className="pl-10 w-full"
                />
              </div>
            </form>
            
            {isMobile && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Sliders className="h-4 w-4" />
                Filters
              </Button>
            )}
          </div>
          
          {/* Mobile filters (collapsible) */}
          {isMobile && filtersVisible && (
            <div className="bg-white shadow rounded-lg p-5 border border-gray-200 mb-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileCity">City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-cities">All Cities</SelectItem>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobileCategory">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between gap-4">
                  <Button type="submit" className="flex-1">Apply</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClearFilters}>Clear</Button>
                </div>
              </form>
            </div>
          )}

          {/* Results section */}
          <div>
            {loading ? (
              <LoadingState isLoading={true} type="card" count={6} />
            ) : deals.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">{deals.length} deals found</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-2">Sort:</p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deals.map(deal => (
                    <DealCard
                      key={deal.id}
                      id={deal.id}
                      title={deal.title}
                      description={deal.description}
                      merchant_name={deal.merchant_name}
                      category={deal.category}
                      expiration_date={deal.expiration_date}
                      discount={deal.discount || ""}
                      image_url={deal.image_url || "/images/placeholders/deal-placeholder.svg"}
                      featured={Boolean(deal.featured)}
                      onClick={() => handleDealClick(deal.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Tag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No deals found</h3>
                <p className="text-gray-500 mb-6">Try changing your filters or search term</p>
                <Button onClick={handleClearFilters}>Clear filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealsPage;
