import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  MapPin,
  DollarSign,
  Filter,
  RotateCcw,
  Tag,
  Calendar,
  ShoppingBag,
  Utensils,
  Briefcase,
  Coffee,
  Store,
  Scissors,
  Home,
  Car,
  Heart,
  Music,
  BookOpen,
  Users,
  Sparkles,
  Film,
  Smartphone,
  Gift,
  Dumbbell,
  Ticket,
  Hotel,
  Map,
  Plane,
  GraduationCap,
  Wrench,
  Landmark,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define category groups with their icons
const categoryGroups = {
  'Food & Drink': [
    { name: 'Restaurants', value: 'restaurants', icon: Utensils },
    { name: 'Cafés', value: 'cafes', icon: Coffee },
    { name: 'Bars', value: 'bars', icon: Coffee },
    { name: 'Fast Food', value: 'fast-food', icon: Utensils },
    { name: 'Other Food & Drink', value: 'other-food', icon: Coffee },
  ],
  'Shopping': [
    { name: 'Fashion', value: 'fashion', icon: ShoppingBag },
    { name: 'Electronics', value: 'electronics', icon: Smartphone },
    { name: 'Home & Decor', value: 'home-decor', icon: Home },
    { name: 'Gifts', value: 'gifts', icon: Gift },
    { name: 'Other Shopping', value: 'other-shopping', icon: ShoppingBag },
  ],
  'Services': [
    { name: 'Beauty', value: 'beauty', icon: Scissors },
    { name: 'Health', value: 'health', icon: Heart },
    { name: 'Professional', value: 'professional', icon: Briefcase },
    { name: 'Home Services', value: 'home-services', icon: Wrench },
    { name: 'Other Services', value: 'other-services', icon: Briefcase },
  ],
  'Events': [
    { name: 'Music', value: 'music', icon: Music },
    { name: 'Arts & Culture', value: 'arts', icon: BookOpen },
    { name: 'Sports', value: 'sports', icon: Dumbbell },
    { name: 'Family', value: 'family', icon: Users },
    { name: 'Other Events', value: 'other-events', icon: Calendar },
  ],
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter states
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    distance: string | null;
    priceRange: string | null;
    sort: string | null;
  }>({
    categories: [],
    distance: null,
    priceRange: null,
    sort: null
  });

  // Filter options
  const filterOptions = {
    // Category filter options
    categories: categoryGroups,

    // Distance filter options
    distance: [
      { name: 'Within 1km', value: '1', icon: MapPin },
      { name: 'Within 5km', value: '5', icon: MapPin },
      { name: 'Within 10km', value: '10', icon: MapPin },
      { name: 'Within 50km', value: '50', icon: MapPin },
    ],

    // Price range options
    priceRange: [
      { name: 'Budget', value: 'budget', icon: DollarSign },
      { name: 'Mid-range', value: 'mid', icon: DollarSign },
      { name: 'Premium', value: 'premium', icon: DollarSign },
    ],

    // Sort options
    sort: [
      { name: 'Newest', value: 'newest', icon: Filter },
      { name: 'Closest', value: 'closest', icon: Filter },
      { name: 'Most Popular', value: 'popular', icon: Filter },
    ],
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      categories: [],
      distance: null,
      priceRange: null,
      sort: null
    });
  };

  // Toggle a category filter
  const toggleCategoryFilter = (value: string) => {
    setActiveFilters(prev => {
      const categories = prev.categories.includes(value)
        ? prev.categories.filter(cat => cat !== value)
        : [...prev.categories, value];

      return {
        ...prev,
        categories
      };
    });
  };

  // Set a filter value
  const setFilter = (type: 'distance' | 'priceRange' | 'sort', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value // Toggle if already selected
    }));
  };

  // Count total active filters
  const activeFilterCount =
    activeFilters.categories.length +
    Object.values(activeFilters).filter(Boolean).length -
    (activeFilters.categories.length ? 1 : 0); // Subtract 1 if categories array exists

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Close the dialog
    onOpenChange(false);

    // Navigate based on active tab and search query
    if (activeTab === 'deals' || activeTab === 'all') {
      navigate(`/deals?q=${encodeURIComponent(searchQuery)}`);
    } else if (activeTab === 'events') {
      navigate(`/events?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Search & Filter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              autoFocus
              type="text"
              placeholder="Search deals, events or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Categories Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(filterOptions.categories).map(([group, categories]) => (
                    <div key={group} className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-500">{group}</h5>
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => toggleCategoryFilter(category.value)}
                          className={cn(
                            "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 transition-colors text-left",
                            activeFilters.categories.includes(category.value) && "bg-gray-100 font-medium"
                          )}
                        >
                          <category.icon className="h-3.5 w-3.5 mr-2 opacity-70" />
                          <span className="truncate">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Distance</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.distance.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter('distance', option.value)}
                      className={cn(
                        "flex items-center px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 transition-colors",
                        activeFilters.distance === option.value
                          ? "bg-gray-100 border-gray-300 font-medium"
                          : "border-gray-200"
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.priceRange.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter('priceRange', option.value)}
                      className={cn(
                        "flex items-center px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 transition-colors",
                        activeFilters.priceRange === option.value
                          ? "bg-gray-100 border-gray-300 font-medium"
                          : "border-gray-200"
                      )}
                    >
                      <DollarSign className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-medium mb-2">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sort.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter('sort', option.value)}
                      className={cn(
                        "flex items-center px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 transition-colors",
                        activeFilters.sort === option.value
                          ? "bg-gray-100 border-gray-300 font-medium"
                          : "border-gray-200"
                      )}
                    >
                      <Filter className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Tabs>

          <DialogFooter className="mt-6 flex justify-between items-center">
            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mr-auto"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset Filters ({activeFilterCount})
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
