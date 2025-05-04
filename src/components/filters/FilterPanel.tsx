import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Define filter types
export type FilterType = 'deals' | 'events';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  discountRange: [number, number];
  distanceRange: number;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: string;
  merchants: string[];
}

interface FilterPanelProps {
  type: FilterType;
  onFilterChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableMerchants: string[];
  className?: string;
  initialFilters?: Partial<FilterState>;
  isMobile?: boolean;
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 1000],
  discountRange: [0, 100],
  distanceRange: 10,
  dateRange: {
    from: undefined,
    to: undefined,
  },
  sortBy: 'newest',
  merchants: [],
};

export const FilterPanel = ({
  type,
  onFilterChange,
  availableCategories,
  availableMerchants,
  className = '',
  initialFilters = {},
  isMobile = false,
}: FilterPanelProps) => {
  // Merge default filters with initial filters
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  
  // Track active filters count for badge
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Track if panel is open (for mobile)
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  // Track saved filter presets
  const [savedPresets, setSavedPresets] = useState<{name: string, filters: FilterState}[]>([]);
  
  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
    
    // Count active filters
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.merchants.length > 0) count++;
    if (filters.distanceRange !== defaultFilters.distanceRange) count++;
    if (filters.sortBy !== defaultFilters.sortBy) count++;
    
    if (type === 'deals') {
      if (filters.priceRange[0] !== defaultFilters.priceRange[0] || 
          filters.priceRange[1] !== defaultFilters.priceRange[1]) count++;
      if (filters.discountRange[0] !== defaultFilters.discountRange[0] || 
          filters.discountRange[1] !== defaultFilters.discountRange[1]) count++;
    } else {
      if (filters.dateRange.from || filters.dateRange.to) count++;
    }
    
    setActiveFilterCount(count);
  }, [filters, onFilterChange, type]);
  
  // Load saved presets from localStorage
  useEffect(() => {
    const savedPresetsString = localStorage.getItem(`citypulse-${type}-filter-presets`);
    if (savedPresetsString) {
      try {
        const presets = JSON.parse(savedPresetsString);
        setSavedPresets(presets);
      } catch (e) {
        console.error('Error loading saved filter presets:', e);
      }
    }
  }, [type]);
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };
  
  // Handle merchant toggle
  const toggleMerchant = (merchant: string) => {
    setFilters(prev => {
      const newMerchants = prev.merchants.includes(merchant)
        ? prev.merchants.filter(m => m !== merchant)
        : [...prev.merchants, merchant];
      
      return {
        ...prev,
        merchants: newMerchants
      };
    });
  };
  
  // Handle distance change
  const handleDistanceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      distanceRange: value[0]
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };
  
  // Handle discount range change
  const handleDiscountRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      discountRange: [value[0], value[1]]
    }));
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: {from: Date | undefined, to: Date | undefined}) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters(defaultFilters);
    toast.success('Filters reset');
  };
  
  // Save current filters as preset
  const savePreset = () => {
    // Prompt for preset name
    const presetName = prompt('Enter a name for this filter preset:');
    if (!presetName) return;
    
    const newPreset = {
      name: presetName,
      filters: {...filters}
    };
    
    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    
    // Save to localStorage
    localStorage.setItem(`citypulse-${type}-filter-presets`, JSON.stringify(updatedPresets));
    
    toast.success(`Filter preset "${presetName}" saved`);
  };
  
  // Load a saved preset
  const loadPreset = (preset: {name: string, filters: FilterState}) => {
    setFilters(preset.filters);
    toast.success(`Filter preset "${preset.name}" loaded`);
  };
  
  // Delete a saved preset
  const deletePreset = (presetName: string) => {
    const updatedPresets = savedPresets.filter(preset => preset.name !== presetName);
    setSavedPresets(updatedPresets);
    
    // Save to localStorage
    localStorage.setItem(`citypulse-${type}-filter-presets`, JSON.stringify(updatedPresets));
    
    toast.success(`Filter preset "${presetName}" deleted`);
  };
  
  // Generate active filter chips
  const renderFilterChips = () => {
    const chips = [];
    
    // Category chips
    filters.categories.forEach(category => {
      chips.push(
        <Badge key={`cat-${category}`} variant="outline" className="flex items-center gap-1">
          {category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => toggleCategory(category)} 
          />
        </Badge>
      );
    });
    
    // Merchant chips
    filters.merchants.forEach(merchant => {
      chips.push(
        <Badge key={`mer-${merchant}`} variant="outline" className="flex items-center gap-1">
          {merchant}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => toggleMerchant(merchant)} 
          />
        </Badge>
      );
    });
    
    // Distance chip
    if (filters.distanceRange !== defaultFilters.distanceRange) {
      chips.push(
        <Badge key="distance" variant="outline" className="flex items-center gap-1">
          Within {filters.distanceRange} km
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleDistanceChange([defaultFilters.distanceRange])} 
          />
        </Badge>
      );
    }
    
    // Price range chip (deals only)
    if (type === 'deals' && 
        (filters.priceRange[0] !== defaultFilters.priceRange[0] || 
         filters.priceRange[1] !== defaultFilters.priceRange[1])) {
      chips.push(
        <Badge key="price" variant="outline" className="flex items-center gap-1">
          R{filters.priceRange[0]} - R{filters.priceRange[1]}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handlePriceRangeChange(defaultFilters.priceRange)} 
          />
        </Badge>
      );
    }
    
    // Discount range chip (deals only)
    if (type === 'deals' && 
        (filters.discountRange[0] !== defaultFilters.discountRange[0] || 
         filters.discountRange[1] !== defaultFilters.discountRange[1])) {
      chips.push(
        <Badge key="discount" variant="outline" className="flex items-center gap-1">
          {filters.discountRange[0]}% - {filters.discountRange[1]}% off
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleDiscountRangeChange(defaultFilters.discountRange)} 
          />
        </Badge>
      );
    }
    
    // Date range chip (events only)
    if (type === 'events' && (filters.dateRange.from || filters.dateRange.to)) {
      const dateText = filters.dateRange.from && filters.dateRange.to
        ? `${format(filters.dateRange.from, 'PP')} - ${format(filters.dateRange.to, 'PP')}`
        : filters.dateRange.from
        ? `From ${format(filters.dateRange.from, 'PP')}`
        : `Until ${format(filters.dateRange.to!, 'PP')}`;
      
      chips.push(
        <Badge key="date" variant="outline" className="flex items-center gap-1">
          {dateText}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleDateRangeChange({from: undefined, to: undefined})} 
          />
        </Badge>
      );
    }
    
    // Sort chip
    if (filters.sortBy !== defaultFilters.sortBy) {
      const sortLabels: Record<string, string> = {
        'newest': 'Newest',
        'popular': 'Most Popular',
        'discount': 'Highest Discount',
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low',
        'distance': 'Closest First',
        'date': 'Soonest First'
      };
      
      chips.push(
        <Badge key="sort" variant="outline" className="flex items-center gap-1">
          Sort: {sortLabels[filters.sortBy]}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleSortChange(defaultFilters.sortBy)} 
          />
        </Badge>
      );
    }
    
    return chips;
  };
  
  // Mobile toggle button
  if (isMobile && !isOpen) {
    return (
      <div className={`${className} flex flex-wrap gap-2 items-center`}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {/* Show filter chips in mobile view */}
        <div className="flex flex-wrap gap-2 mt-2">
          {renderFilterChips()}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} bg-white rounded-lg border p-4 ${isMobile ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Filter chips */}
      {renderFilterChips().length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {renderFilterChips()}
          <Badge 
            variant="outline" 
            className="bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
            onClick={resetFilters}
          >
            Clear All
          </Badge>
        </div>
      )}
      
      {/* Saved presets */}
      {savedPresets.length > 0 && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="saved-presets">
            <AccordionTrigger>Saved Filter Presets</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2">
                {savedPresets.map((preset) => (
                  <div key={preset.name} className="flex items-center justify-between">
                    <span>{preset.name}</span>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => loadPreset(preset)}
                      >
                        Load
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deletePreset(preset.name)}
                        className="text-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories" className="mb-4">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Distance */}
      <Accordion type="single" collapsible defaultValue="distance" className="mb-4">
        <AccordionItem value="distance">
          <AccordionTrigger>Distance</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Deal-specific filters */}
      {type === 'deals' && (
        <>
          {/* Price Range */}
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Discount Range */}
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="discount">
              <AccordionTrigger>Discount Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
      
      {/* Event-specific filters */}
      {type === 'events' && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="date">
            <AccordionTrigger>Date Range</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, 'PPP')} -{' '}
                            {format(filters.dateRange.to, 'PPP')}
                          </>
                        ) : (
                          format(filters.dateRange.from, 'PPP')
                        )
                      ) : (
                        'Pick a date range'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange.from}
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                      }}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                
                {(filters.dateRange.from || filters.dateRange.to) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDateRangeChange({from: undefined, to: undefined})}
                  >
                    Clear dates
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Merchants */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="merchants">
          <AccordionTrigger>Merchants</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {availableMerchants.map((merchant) => (
                <div key={merchant} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`merchant-${merchant}`} 
                    checked={filters.merchants.includes(merchant)}
                    onCheckedChange={() => toggleMerchant(merchant)}
                  />
                  <Label htmlFor={`merchant-${merchant}`}>{merchant}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Sort By */}
      <div className="mb-4">
        <Label htmlFor="sort-by">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-by">
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
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
        >
          Reset All
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={savePreset}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          Save Filters
        </Button>
      </div>
      
      {/* Apply button for mobile */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white p-4 border-t mt-4">
          <Button 
            className="w-full" 
            onClick={() => setIsOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
