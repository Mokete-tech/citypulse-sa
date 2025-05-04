import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  discountRange: [number, number];
  distanceRange: number;
  sortBy: string;
  merchants: string[];
}

interface FilterBarProps {
  type: 'deals' | 'events';
  availableCategories: string[];
  availableMerchants: string[];
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const defaultFilters: FilterOptions = {
  categories: [],
  priceRange: [0, 1000],
  discountRange: [0, 100],
  distanceRange: 10,
  sortBy: 'newest',
  merchants: [],
};

export const FilterBar = ({
  type,
  availableCategories,
  availableMerchants,
  onFilterChange,
  className = '',
}: FilterBarProps) => {
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  
  // State for mobile filter panel
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: false,
    distance: true,
    sort: false,
    merchants: false,
  });
  
  // Load saved filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem(`citypulse-${type}-filters`);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
  }, [type]);
  
  // Save filters to localStorage and notify parent when filters change
  useEffect(() => {
    localStorage.setItem(`citypulse-${type}-filters`, JSON.stringify(filters));
    onFilterChange(filters);
  }, [filters, onFilterChange, type]);
  
  // Toggle category filter
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };
  
  // Toggle merchant filter
  const toggleMerchant = (merchant: string) => {
    setFilters(prev => {
      const newMerchants = prev.merchants.includes(merchant)
        ? prev.merchants.filter(m => m !== merchant)
        : [...prev.merchants, merchant];
      
      return {
        ...prev,
        merchants: newMerchants,
      };
    });
  };
  
  // Update price range
  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };
  
  // Update discount range
  const handleDiscountRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      discountRange: [value[0], value[1]],
    }));
  };
  
  // Update distance range
  const handleDistanceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      distanceRange: value[0],
    }));
  };
  
  // Update sort option
  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value,
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters(defaultFilters);
    toast.success('Filters reset to defaults');
  };
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  // Count active filters
  const activeFilterCount = 
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.merchants.length > 0 ? 1 : 0) +
    (filters.distanceRange !== defaultFilters.distanceRange ? 1 : 0) +
    (filters.sortBy !== defaultFilters.sortBy ? 1 : 0) +
    (filters.priceRange[0] !== defaultFilters.priceRange[0] || 
     filters.priceRange[1] !== defaultFilters.priceRange[1] ? 1 : 0) +
    (filters.discountRange[0] !== defaultFilters.discountRange[0] || 
     filters.discountRange[1] !== defaultFilters.discountRange[1] ? 1 : 0);
  
  // Mobile filter toggle button
  const mobileFilterButton = (
    <Button 
      variant="outline" 
      size="sm" 
      className="md:hidden flex items-center gap-2"
      onClick={() => setShowMobileFilters(true)}
    >
      <Filter className="h-4 w-4" />
      Filters
      {activeFilterCount > 0 && (
        <Badge variant="secondary" className="ml-1">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
  
  // Filter chips to show active filters
  const filterChips = (
    <div className="flex flex-wrap gap-2 mt-2">
      {filters.categories.map(category => (
        <Badge 
          key={`cat-${category}`} 
          variant="outline"
          className="flex items-center gap-1"
        >
          {category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => toggleCategory(category)} 
          />
        </Badge>
      ))}
      
      {filters.merchants.map(merchant => {
        const merchantName = availableMerchants.find(m => m === merchant) || merchant;
        return (
          <Badge 
            key={`mer-${merchant}`} 
            variant="outline"
            className="flex items-center gap-1"
          >
            {merchantName}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => toggleMerchant(merchant)} 
            />
          </Badge>
        );
      })}
      
      {filters.distanceRange !== defaultFilters.distanceRange && (
        <Badge 
          variant="outline"
          className="flex items-center gap-1"
        >
          Within {filters.distanceRange} km
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleDistanceChange([defaultFilters.distanceRange])} 
          />
        </Badge>
      )}
      
      {(filters.priceRange[0] !== defaultFilters.priceRange[0] || 
        filters.priceRange[1] !== defaultFilters.priceRange[1]) && (
        <Badge 
          variant="outline"
          className="flex items-center gap-1"
        >
          R{filters.priceRange[0]} - R{filters.priceRange[1]}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handlePriceRangeChange(defaultFilters.priceRange)} 
          />
        </Badge>
      )}
      
      {(filters.discountRange[0] !== defaultFilters.discountRange[0] || 
        filters.discountRange[1] !== defaultFilters.discountRange[1]) && (
        <Badge 
          variant="outline"
          className="flex items-center gap-1"
        >
          {filters.discountRange[0]}% - {filters.discountRange[1]}% off
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleDiscountRangeChange(defaultFilters.discountRange)} 
          />
        </Badge>
      )}
      
      {filters.sortBy !== defaultFilters.sortBy && (
        <Badge 
          variant="outline"
          className="flex items-center gap-1"
        >
          Sort: {filters.sortBy}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleSortChange(defaultFilters.sortBy)} 
          />
        </Badge>
      )}
      
      {activeFilterCount > 0 && (
        <Badge 
          variant="outline" 
          className="bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
          onClick={resetFilters}
        >
          Clear All
        </Badge>
      )}
    </div>
  );
  
  // Mobile filter panel
  const mobileFilterPanel = showMobileFilters && (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4 md:hidden">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowMobileFilters(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Filter content */}
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('categories')}
          >
            <h4 className="font-medium">Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedSections.categories && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mobile-category-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Distance */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('distance')}
          >
            <h4 className="font-medium">Distance</h4>
            {expandedSections.distance ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedSections.distance && (
            <div className="space-y-4 mt-2">
              <div className="flex justify-between">
                <span>Within {filters.distanceRange} km</span>
              </div>
              <Slider
                value={[filters.distanceRange]}
                min={1}
                max={50}
                step={1}
                onValueChange={handleDistanceChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Price Range (for deals only) */}
        {type === 'deals' && (
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('price')}
            >
              <h4 className="font-medium">Price Range</h4>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {expandedSections.price && (
              <div className="space-y-4 mt-2">
                <div className="flex justify-between">
                  <span>R{filters.priceRange[0]} - R{filters.priceRange[1]}</span>
                </div>
                <Slider
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceRangeChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R0</span>
                  <span>R1000+</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Discount Range (for deals only) */}
        {type === 'deals' && (
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('discount')}
            >
              <h4 className="font-medium">Discount Range</h4>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {expandedSections.price && (
              <div className="space-y-4 mt-2">
                <div className="flex justify-between">
                  <span>{filters.discountRange[0]}% - {filters.discountRange[1]}%</span>
                </div>
                <Slider
                  value={[filters.discountRange[0], filters.discountRange[1]]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleDiscountRangeChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Sort By */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('sort')}
          >
            <h4 className="font-medium">Sort By</h4>
            {expandedSections.sort ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedSections.sort && (
            <div className="mt-2">
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="distance">Closest First</SelectItem>
                  {type === 'deals' && (
                    <>
                      <SelectItem value="discount">Highest Discount</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </>
                  )}
                  {type === 'events' && (
                    <SelectItem value="date">Soonest First</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {/* Merchants */}
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('merchants')}
          >
            <h4 className="font-medium">Merchants</h4>
            {expandedSections.merchants ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedSections.merchants && (
            <div className="grid grid-cols-1 gap-2 mt-2">
              {availableMerchants.map(merchant => (
                <div key={merchant} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mobile-merchant-${merchant}`} 
                    checked={filters.merchants.includes(merchant)}
                    onCheckedChange={() => toggleMerchant(merchant)}
                  />
                  <Label htmlFor={`mobile-merchant-${merchant}`}>{merchant}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Apply button */}
      <div className="sticky bottom-0 bg-white p-4 border-t mt-4">
        <Button 
          className="w-full" 
          onClick={() => setShowMobileFilters(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
  
  // Desktop filter panel
  const desktopFilterPanel = (
    <Card className={`hidden md:block ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('categories')}
            >
              <h4 className="font-medium">Categories</h4>
              {expandedSections.categories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {expandedSections.categories && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`desktop-category-${category}`} 
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`desktop-category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Distance */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('distance')}
            >
              <h4 className="font-medium">Distance</h4>
              {expandedSections.distance ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {expandedSections.distance && (
              <div className="space-y-4 mt-2">
                <div className="flex justify-between">
                  <span>Within {filters.distanceRange} km</span>
                </div>
                <Slider
                  value={[filters.distanceRange]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={handleDistanceChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Price Range (for deals only) */}
          {type === 'deals' && (
            <div>
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <h4 className="font-medium">Price Range</h4>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              
              {expandedSections.price && (
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between">
                    <span>R{filters.priceRange[0]} - R{filters.priceRange[1]}</span>
                  </div>
                  <Slider
                    value={[filters.priceRange[0], filters.priceRange[1]]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={handlePriceRangeChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R0</span>
                    <span>R1000+</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Sort By */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('sort')}
            >
              <h4 className="font-medium">Sort By</h4>
              {expandedSections.sort ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {expandedSections.sort && (
              <div className="mt-2">
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="distance">Closest First</SelectItem>
                    {type === 'deals' && (
                      <>
                        <SelectItem value="discount">Highest Discount</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </>
                    )}
                    {type === 'events' && (
                      <SelectItem value="date">Soonest First</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Reset button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <>
      {mobileFilterButton}
      {filterChips}
      {mobileFilterPanel}
      {desktopFilterPanel}
    </>
  );
};

export default FilterBar;
