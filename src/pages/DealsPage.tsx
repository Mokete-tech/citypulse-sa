
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Search, MapPin, Tag, Filter, Sliders, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Desktop filters sidebar - collapsed by default on desktop */}
        <div className={`lg:col-span-1 ${isMobile ? 'hidden' : 'block'}`}>
          <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-7">
                Clear all
              </Button>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              {/* Location Filter */}
              <AccordionItem value="location" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm">Location</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-cities">All Cities</SelectItem>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              {/* Category Filter */}
              <AccordionItem value="category" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm">Category</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              {/* Sort By Filter */}
              <AccordionItem value="sort" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm">Sort By</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="newest" className="h-3 w-3" />
                      <Label htmlFor="newest" className="text-sm">Newest First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price_low" id="price_low" className="h-3 w-3" />
                      <Label htmlFor="price_low" className="text-sm">Price: Low to High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price_high" id="price_high" className="h-3 w-3" />
                      <Label htmlFor="price_high" className="text-sm">Price: High to Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="popularity" id="popularity" className="h-3 w-3" />
                      <Label htmlFor="popularity" className="text-sm">Popularity</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              
              {/* Price Range Filter */}
              <AccordionItem value="price" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm">Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-6">
                    <Slider 
                      defaultValue={[priceRange[0], priceRange[1]]} 
                      max={1000} 
                      step={1}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      className="mb-2"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Featured Only Filter */}
              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="featuredOnly" 
                  checked={featuredOnly}
                  onCheckedChange={(checked) => setFeaturedOnly(checked as boolean)}
                  className="h-3.5 w-3.5"
                />
                <Label htmlFor="featuredOnly" className="text-sm">Featured Deals Only</Label>
              </div>
              
              <Button type="button" className="w-full h-8 text-sm mt-2" onClick={handleSearch}>
                Apply Filters
              </Button>
            </Accordion>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search deals..."
                  className="pl-8 w-full h-9"
                />
              </div>
              <Button size="sm" type="submit" className="ml-2 h-9">Search</Button>
            </form>
            
            {/* Mobile filters button */}
            {isMobile && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-9"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Sliders className="h-3.5 w-3.5" />
                Filters
              </Button>
            )}
          </div>
          
          {/* Mobile filters (collapsible) */}
          {isMobile && filtersVisible && (
            <div className="bg-white shadow rounded-lg p-3 border border-gray-200 mb-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="mobileFilters" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium">Quick Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-cities">All Cities</SelectItem>
                          {CITIES.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-categories">All Categories</SelectItem>
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="price_low">Price: Low to High</SelectItem>
                          <SelectItem value="price_high">Price: High to Low</SelectItem>
                          <SelectItem value="popularity">Popularity</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center space-x-2 h-8 pl-2">
                        <Checkbox 
                          id="mobileFeaturedOnly" 
                          checked={featuredOnly}
                          onCheckedChange={(checked) => setFeaturedOnly(checked as boolean)}
                          className="h-3.5 w-3.5"
                        />
                        <Label htmlFor="mobileFeaturedOnly" className="text-xs">Featured Only</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between gap-2 mt-3">
                      <Button size="sm" type="button" className="flex-1 h-8 text-xs" onClick={handleSearch}>
                        Apply
                      </Button>
                      <Button size="sm" type="button" variant="outline" className="flex-1 h-8 text-xs" onClick={handleClearFilters}>
                        Clear
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Results section */}
          <div>
            {loading ? (
              <LoadingState isLoading={true} type="card" count={4} />
            ) : deals.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-500">{deals.length} deals found</p>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 mr-1">Sort:</p>
                    <Select value={sortBy} onValueChange={(value) => {
                      setSortBy(value);
                      handleSearch(new Event('submit') as any);
                    }}>
                      <SelectTrigger className="h-7 w-[140px] text-xs">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
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
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-base font-medium mb-1">No deals found</h3>
                <p className="text-sm text-gray-500 mb-4">Try changing your filters or search term</p>
                <Button size="sm" onClick={handleClearFilters}>Clear filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealsPage;
