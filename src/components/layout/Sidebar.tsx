
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Tag, Calendar, LogIn, ChevronLeft, CreditCard, ChevronDown,
  Search, X, MapPin, Clock, DollarSign, Filter, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Deals', icon: Tag, path: '/deals' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Merchant Login', icon: LogIn, path: '/merchant/login' },
  { name: 'Merchant Packages', icon: CreditCard, path: '/merchant/packages' },
];

// Filter categories data with count and icon information
const filterCategories = [
  { name: 'Food & Drink', color: 'bg-amber-400', path: '/deals?category=food-drink', count: 12, icon: DollarSign },
  { name: 'Retail', color: 'bg-emerald-400', path: '/deals?category=retail', count: 8, icon: Tag },
  { name: 'Beauty', color: 'bg-pink-400', path: '/deals?category=beauty', count: 5, icon: Tag },
  { name: 'Entertainment', color: 'bg-purple-400', path: '/deals?category=entertainment', count: 7, icon: Tag },
  { name: 'Travel', color: 'bg-blue-400', path: '/deals?category=travel', count: 4, icon: MapPin },
];

// Distance filter options
const distanceOptions = [
  { name: 'Within 1km', value: '1' },
  { name: 'Within 5km', value: '5' },
  { name: 'Within 10km', value: '10' },
  { name: 'Within 50km', value: '50' },
];

// Price range options
const priceRangeOptions = [
  { name: 'Budget', value: 'budget' },
  { name: 'Mid-range', value: 'mid' },
  { name: 'Premium', value: 'premium' },
];

// Sort options
const sortOptions = [
  { name: 'Newest', value: 'newest' },
  { name: 'Popularity', value: 'popularity' },
  { name: 'Price: Low to High', value: 'price_asc' },
  { name: 'Price: High to Low', value: 'price_desc' },
];

// Event types data with count and icon information
const eventTypes = [
  { name: 'Music', color: 'bg-red-400', path: '/events?category=music', count: 9, icon: Calendar },
  { name: 'Food & Shopping', color: 'bg-yellow-400', path: '/events?category=food-shopping', count: 6, icon: Calendar },
  { name: 'Networking', color: 'bg-indigo-400', path: '/events?category=networking', count: 4, icon: Calendar },
  { name: 'Sports', color: 'bg-green-400', path: '/events?category=sports', count: 7, icon: Calendar },
  { name: 'Arts & Culture', color: 'bg-orange-400', path: '/events?category=arts', count: 5, icon: Calendar },
];

// Enhanced collapsible section component with localStorage persistence
interface CollapsibleSectionProps {
  title: string;
  id: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: number;
}

const CollapsibleSection = ({
  title,
  id,
  children,
  defaultExpanded = true,
  badge
}: CollapsibleSectionProps) => {
  // Initialize state from localStorage or default
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      // Check if we have a stored preference
      const storedState = localStorage.getItem(`sidebar-section-${id}`);
      // If on mobile, default to collapsed
      if (window.innerWidth < 768) return false;
      // Otherwise use stored preference or default
      return storedState !== null ? storedState === 'true' : defaultExpanded;
    } catch (e) {
      // If localStorage fails, use default
      return defaultExpanded;
    }
  });

  // Content ref for measuring height
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  // Update content height when expanded state changes
  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Get the scrollHeight of the content
        setContentHeight(contentRef.current.scrollHeight);
      } else {
        // Set to 0 when collapsed
        setContentHeight(0);
      }
    }
  }, [isExpanded]);

  // Toggle section expanded state
  const toggleSection = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    try {
      localStorage.setItem(`sidebar-section-${id}`, newState.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;

      try {
        // Only auto-adjust if user hasn't manually set it
        const userHasSetPreference = localStorage.getItem(`sidebar-section-${id}`) !== null;

        if (!userHasSetPreference) {
          // Auto-collapse on mobile, expand on desktop
          setIsExpanded(!isMobileView);
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [id]);

  return (
    <div className="mt-6 px-4">
      <button
        onClick={toggleSection}
        className="flex items-center justify-between w-full text-sm font-semibold mb-2 text-white/80 hover:text-white transition-colors group"
        aria-expanded={isExpanded}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center">
          <span>{title}</span>
          {badge !== undefined && (
            <Badge variant="outline" className="ml-2 bg-sky-700/50 text-white text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-in-out group-hover:text-white",
            isExpanded ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>

      <div
        id={`section-${id}`}
        ref={contentRef}
        style={{ maxHeight: contentHeight !== undefined ? `${contentHeight}px` : isExpanded ? '1000px' : '0' }}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "opacity-100" : "opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for active filters
  const [activeFilters, setActiveFilters] = useState<{
    distance: string | null;
    priceRange: string | null;
    sort: string | null;
  }>({
    distance: null,
    priceRange: null,
    sort: null
  });

  // Get current location for active menu highlighting
  const location = useLocation();

  // Filter categories based on search query
  const filteredCategories = filterCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter event types based on search query
  const filteredEventTypes = eventTypes.filter(eventType =>
    eventType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      distance: null,
      priceRange: null,
      sort: null
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
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sa-blue text-white transform transition-all duration-300 ease-in-out",
        // Mobile: translate based on isOpen state
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: translate based on isOpen state (fixed)
        isOpen ? "md:translate-x-0" : "md:-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sky-700">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <div className="bg-gradient-to-r from-white to-gray-200 p-1.5 rounded-md">
                <span className="text-sa-blue font-bold">CP</span>
              </div>
              <span>CityPulse</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Search input */}
          <div className="p-4 border-b border-sky-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-2 bg-sky-800/50 border-sky-700 text-white placeholder:text-gray-400 w-full focus:ring-sky-500 focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      location.pathname === item.path && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Filter Categories */}
            <CollapsibleSection
              title="Filter Categories"
              id="filter-categories"
              badge={filterCategories.length}
              defaultExpanded={true}
            >
              {searchQuery && filteredCategories.length === 0 ? (
                <p className="text-sm text-gray-400 px-3 py-2">No categories match your search</p>
              ) : (
                <ul className="space-y-1">
                  {(searchQuery ? filteredCategories : filterCategories).map((category) => (
                    <li key={category.name}>
                      <Link
                        to={category.path}
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors group"
                      >
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${category.color} mr-2`}></span>
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-sky-800/30 text-gray-300 text-xs group-hover:bg-sky-700">
                          {category.count}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            {/* Event Categories */}
            <CollapsibleSection
              title="Event Types"
              id="event-types"
              badge={eventTypes.length}
              defaultExpanded={true}
            >
              {searchQuery && filteredEventTypes.length === 0 ? (
                <p className="text-sm text-gray-400 px-3 py-2">No event types match your search</p>
              ) : (
                <ul className="space-y-1">
                  {(searchQuery ? filteredEventTypes : eventTypes).map((eventType) => (
                    <li key={eventType.name}>
                      <Link
                        to={eventType.path}
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors group"
                      >
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${eventType.color} mr-2`}></span>
                          <span>{eventType.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-sky-800/30 text-gray-300 text-xs group-hover:bg-sky-700">
                          {eventType.count}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            {/* Distance Filter */}
            <CollapsibleSection
              title="Distance"
              id="distance-filter"
              defaultExpanded={false}
            >
              <ul className="space-y-1">
                {distanceOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => setFilter('distance', option.value)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors text-left",
                        activeFilters.distance === option.value && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <MapPin className="h-4 w-4 mr-2 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Price Range Filter */}
            <CollapsibleSection
              title="Price Range"
              id="price-filter"
              defaultExpanded={false}
            >
              <ul className="space-y-1">
                {priceRangeOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => setFilter('priceRange', option.value)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors text-left",
                        activeFilters.priceRange === option.value && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <DollarSign className="h-4 w-4 mr-2 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Sort Options */}
            <CollapsibleSection
              title="Sort By"
              id="sort-options"
              defaultExpanded={false}
            >
              <ul className="space-y-1">
                {sortOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => setFilter('sort', option.value)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors text-left",
                        activeFilters.sort === option.value && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <Filter className="h-4 w-4 mr-2 opacity-70" />
                      <span>{option.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Reset Filters Button */}
            {activeFilterCount > 0 && (
              <div className="px-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full bg-sky-800/30 border-sky-700 hover:bg-sky-700 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Filters ({activeFilterCount})
                </Button>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-sky-700">
            <div className="px-4 py-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-sky-700 flex items-center justify-center">
                  <span className="font-medium text-white">CP</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">CityPulse</p>
                  <p className="text-xs opacity-70">South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={cn(
        "hidden md:block fixed bottom-4 z-50 transition-all duration-300",
        isOpen ? "left-72" : "left-0"
      )}>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-l-none shadow-md"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
          <span className="sr-only">{isOpen ? "Close sidebar" : "Open sidebar"}</span>
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
