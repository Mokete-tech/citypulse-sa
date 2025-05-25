import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Tag, Calendar, Flame, Search, Filter, Plus, ArrowUpDown, X, Star, Clock, TrendingUp, Users, DollarSign, Percent, Lightbulb, Store, Coffee, BookOpen, Utensils, Scissors, Dumbbell, Palette, Info, Cookie, PawPrint, Wrench, Leaf, Sun, Snowflake, Gift, Heart, GraduationCap, Turkey, Sparkles, Gamepad2, Music, Camera, Rocket, Brain, Microscope, Palette, Sparkles, Wand2, Compass, Globe, Leaf, Sun, Moon, Star, Cloud, Wind, Droplets, Flame, Mountain, Waves, Trees, Flower, Seedling, Sprout, Rainbow, Umbrella, Snowflake, Sun, Moon, Star, Cloud, Wind, Droplets, Flame, Mountain, Waves, Trees, Flower, Seedling, Sprout, Rainbow, Umbrella, Snowflake } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: string;
  views: number;
  redemptions: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  capacity: number;
}

interface Template {
  id: string;
  name: string;
  icon: React.ElementType;
  deals: Deal[];
  events: Event[];
  bestPractices: string[];
}

interface SeasonalPromotion {
  id: string;
  name: string;
  icon: React.ElementType;
  deals: Deal[];
  events: Event[];
}

interface CreativeTemplate extends Template {}

const BusinessOptimizer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [savedFilters, setSavedFilters] = useState<Array<{
    name: string;
    filters: {
      search: string;
      category: string;
      sort: string;
      dateRange: { from: Date | undefined; to: Date | undefined };
    };
  }>>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const applyDatePreset = (preset: string) => {
    const today = new Date();
    switch (preset) {
      case 'today':
        setDateRange({ from: today, to: today });
        break;
      case 'yesterday':
        setDateRange({ from: subDays(today, 1), to: subDays(today, 1) });
        break;
      case 'last7Days':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case 'last30Days':
        setDateRange({ from: subDays(today, 30), to: today });
        break;
      case 'thisWeek':
        setDateRange({ from: startOfWeek(today), to: endOfWeek(today) });
        break;
      case 'lastWeek':
        setDateRange({ 
          from: startOfWeek(subDays(today, 7)), 
          to: endOfWeek(subDays(today, 7)) 
        });
        break;
      case 'nextWeek':
        setDateRange({ 
          from: addDays(startOfWeek(today), 7), 
          to: addDays(endOfWeek(today), 7) 
        });
        break;
      case 'thisMonth':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case 'lastMonth':
        setDateRange({ 
          from: startOfMonth(subMonths(today, 1)), 
          to: endOfMonth(subMonths(today, 1)) 
        });
        break;
      case 'nextMonth':
        const nextMonth = addDays(today, 30);
        setDateRange({ 
          from: startOfMonth(nextMonth), 
          to: endOfMonth(nextMonth) 
        });
        break;
      case 'clear':
        setDateRange({ from: undefined, to: undefined });
        break;
    }
  };

  const applyFilterCombination = (combination: string) => {
    switch (combination) {
      case 'popularThisWeek':
        setSortBy('popular');
        applyDatePreset('thisWeek');
        break;
      case 'endingSoon':
        setSortBy('oldest');
        applyDatePreset('last7Days');
        break;
      case 'newDeals':
        setSortBy('newest');
        applyDatePreset('last7Days');
        break;
      case 'upcomingEvents':
        setSortBy('newest');
        applyDatePreset('nextWeek');
        break;
      case 'trendingDeals':
        setSortBy('popular');
        applyDatePreset('last30Days');
        break;
      case 'highConversion':
        setSortBy('popular');
        setSelectedCategory('flash');
        applyDatePreset('last30Days');
        break;
      case 'bestSellers':
        setSortBy('popular');
        setSelectedCategory('monthly');
        applyDatePreset('last30Days');
        break;
      case 'clearAll':
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('newest');
        setDateRange({ from: undefined, to: undefined });
        break;
    }
  };

  const saveCurrentFilters = () => {
    const name = prompt('Enter a name for this filter combination:');
    if (name) {
      setSavedFilters([
        ...savedFilters,
        {
          name,
          filters: {
            search: searchQuery,
            category: selectedCategory,
            sort: sortBy,
            dateRange
          }
        }
      ]);
    }
  };

  const applySavedFilter = (filter: typeof savedFilters[0]) => {
    setSearchQuery(filter.filters.search);
    setSelectedCategory(filter.filters.category);
    setSortBy(filter.filters.sort);
    setDateRange(filter.filters.dateRange);
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchQuery) filters.push({ type: 'search', label: `Search: ${searchQuery}` });
    if (selectedCategory !== 'all') filters.push({ type: 'category', label: `Category: ${selectedCategory}` });
    if (dateRange.from) {
      const dateLabel = dateRange.to 
        ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
        : format(dateRange.from, "MMM dd");
      filters.push({ type: 'date', label: `Date: ${dateLabel}` });
    }
    if (sortBy !== 'newest') filters.push({ type: 'sort', label: `Sort: ${sortBy}` });
    return filters;
  };

  const removeFilter = (type: string) => {
    switch (type) {
      case 'search':
        setSearchQuery('');
        break;
      case 'category':
        setSelectedCategory('all');
        break;
      case 'date':
        setDateRange({ from: undefined, to: undefined });
        break;
      case 'sort':
        setSortBy('newest');
        break;
    }
  };

  const sortItems = (items: Deal[] | Event[], type: 'deals' | 'events') => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.validUntil || b.date).getTime() - new Date(a.validUntil || a.date).getTime();
        case 'oldest':
          return new Date(a.validUntil || a.date).getTime() - new Date(b.validUntil || b.date).getTime();
        case 'popular':
          return type === 'deals' 
            ? (b as Deal).views - (a as Deal).views 
            : (b as Event).attendees - (a as Event).attendees;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filterByDateRange = (items: Deal[] | Event[], type: 'deals' | 'events') => {
    if (!dateRange.from && !dateRange.to) return items;
    
    return items.filter(item => {
      const itemDate = new Date(type === 'deals' ? (item as Deal).validUntil : (item as Event).date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    });
  };

  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const sortedAndFilteredDeals = filterByDateRange(sortItems(filteredDeals, 'deals'), 'deals');
  const sortedAndFilteredEvents = filterByDateRange(sortItems(filteredEvents, 'events'), 'events');

  const activeFilters = getActiveFilters();

  const filterStats = useMemo(() => {
    const totalDeals = deals.length;
    const totalEvents = events.length;
    const filteredDealsCount = sortedAndFilteredDeals.length;
    const filteredEventsCount = sortedAndFilteredEvents.length;
    const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value') || 'deals';
    
    const stats = {
      total: activeTab === 'deals' ? totalDeals : totalEvents,
      filtered: activeTab === 'deals' ? filteredDealsCount : filteredEventsCount,
      percentage: activeTab === 'deals' 
        ? Math.round((filteredDealsCount / totalDeals) * 100)
        : Math.round((filteredEventsCount / totalEvents) * 100)
    };

    return stats;
  }, [deals.length, events.length, sortedAndFilteredDeals.length, sortedAndFilteredEvents.length]);

  const quickStartTemplates = [
    {
      id: 'coffee-shop',
      name: 'Coffee Shop',
      icon: Coffee,
      deals: [
        {
          title: 'Morning Special: Buy 1 Get 1 Free',
          description: 'Get a free coffee with any breakfast item purchase',
          discount: 'BOGO',
          validUntil: '2024-03-25',
          category: 'flash',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Weekend Bundle: Coffee + Pastry',
          description: 'Enjoy a coffee and pastry for a special weekend price',
          discount: '20% OFF',
          validUntil: '2024-03-31',
          category: 'weekly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Coffee Tasting Event',
          description: 'Join us for a special coffee tasting session',
          date: '2024-03-30',
          time: '2:00 PM - 4:00 PM',
          location: 'Store',
          category: 'tasting',
          attendees: 0,
          capacity: 20
        }
      ],
      bestPractices: [
        'Offer morning specials to drive early traffic',
        'Create weekend bundles to increase average order value',
        'Host tasting events to build community and loyalty',
        'Use social media to promote daily specials'
      ]
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: Utensils,
      deals: [
        {
          title: 'Happy Hour Special',
          description: '50% off appetizers and drinks',
          discount: '50% OFF',
          validUntil: '2024-03-31',
          category: 'weekly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Family Dinner Package',
          description: '4-course meal for 4 people at a special price',
          discount: '30% OFF',
          validUntil: '2024-04-05',
          category: 'monthly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Chef\'s Table Experience',
          description: 'Exclusive tasting menu with the chef',
          date: '2024-04-02',
          time: '7:00 PM - 9:00 PM',
          location: 'Restaurant',
          category: 'tasting',
          attendees: 0,
          capacity: 12
        }
      ],
      bestPractices: [
        'Create time-based promotions to fill slow periods',
        'Offer family packages to increase group bookings',
        'Host special events to showcase your chef\'s expertise',
        'Use seasonal ingredients in your promotions'
      ]
    },
    {
      id: 'salon',
      name: 'Hair Salon',
      icon: Scissors,
      deals: [
        {
          title: 'New Client Special',
          description: '20% off first visit',
          discount: '20% OFF',
          validUntil: '2024-03-31',
          category: 'monthly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Package Deal: Cut & Color',
          description: 'Save 15% when you book both services',
          discount: '15% OFF',
          validUntil: '2024-04-05',
          category: 'weekly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Styling Workshop',
          description: 'Learn professional styling techniques',
          date: '2024-03-28',
          time: '6:00 PM - 8:00 PM',
          location: 'Salon',
          category: 'workshop',
          attendees: 0,
          capacity: 15
        }
      ],
      bestPractices: [
        'Offer first-time client discounts to build your client base',
        'Create service packages to increase average ticket value',
        'Host workshops to showcase your expertise',
        'Use social media to share before/after transformations'
      ]
    },
    {
      id: 'gym',
      name: 'Fitness Center',
      icon: Dumbbell,
      deals: [
        {
          title: 'New Year Special',
          description: '3 months membership for the price of 2',
          discount: '33% OFF',
          validUntil: '2024-03-31',
          category: 'monthly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Bring a Friend Week',
          description: 'Free guest pass with your membership',
          discount: 'Free Guest',
          validUntil: '2024-04-05',
          category: 'weekly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Fitness Challenge',
          description: '30-day transformation challenge',
          date: '2024-04-01',
          time: '6:00 PM - 7:00 PM',
          location: 'Gym',
          category: 'workshop',
          attendees: 0,
          capacity: 30
        }
      ],
      bestPractices: [
        'Offer longer-term memberships to increase retention',
        'Create challenges to keep members engaged',
        'Host free classes to attract new members',
        'Use social media to share success stories'
      ]
    },
    {
      id: 'art-studio',
      name: 'Art Studio',
      icon: Palette,
      deals: [
        {
          title: 'First Class Free',
          description: 'Try any class for free',
          discount: '100% OFF',
          validUntil: '2024-03-31',
          category: 'monthly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Package Deal: 5 Classes',
          description: 'Save 20% when you book 5 classes',
          discount: '20% OFF',
          validUntil: '2024-04-05',
          category: 'bulk',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Open Studio Night',
          description: 'Drop-in art session with materials provided',
          date: '2024-03-29',
          time: '6:00 PM - 9:00 PM',
          location: 'Studio',
          category: 'workshop',
          attendees: 0,
          capacity: 20
        }
      ],
      bestPractices: [
        'Offer free trials to reduce barriers to entry',
        'Create class packages to encourage regular attendance',
        'Host open studio nights to build community',
        'Share student artwork on social media'
      ]
    },
    {
      id: 'bakery',
      name: 'Bakery',
      icon: Cookie,
      deals: [
        {
          title: 'Early Bird Special',
          description: '20% off all items before 9 AM',
          discount: '20% OFF',
          validUntil: '2024-03-31',
          category: 'weekly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Birthday Cake Package',
          description: 'Free delivery with any cake order',
          discount: 'Free Delivery',
          validUntil: '2024-04-05',
          category: 'monthly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Cake Decorating Class',
          description: 'Learn professional cake decorating techniques',
          date: '2024-03-30',
          time: '2:00 PM - 4:00 PM',
          location: 'Bakery',
          category: 'workshop',
          attendees: 0,
          capacity: 12
        }
      ],
      bestPractices: [
        'Offer early bird specials to drive morning traffic',
        'Create custom cake packages for special occasions',
        'Host decorating classes to showcase your expertise',
        'Use social media to showcase daily specials'
      ]
    },
    {
      id: 'pet-store',
      name: 'Pet Store',
      icon: PawPrint,
      deals: [
        {
          title: 'First Visit Package',
          description: 'Free health check with any purchase',
          discount: 'Free Check-up',
          validUntil: '2024-03-31',
          category: 'monthly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Bulk Food Discount',
          description: '15% off when buying 3 or more bags',
          discount: '15% OFF',
          validUntil: '2024-04-05',
          category: 'bulk',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Pet Adoption Day',
          description: 'Meet adoptable pets from local shelters',
          date: '2024-04-02',
          time: '11:00 AM - 4:00 PM',
          location: 'Store',
          category: 'showcase',
          attendees: 0,
          capacity: 50
        }
      ],
      bestPractices: [
        'Offer first-time customer packages to build loyalty',
        'Create bulk purchase incentives for regular items',
        'Host adoption events to drive foot traffic',
        'Use social media to share pet care tips'
      ]
    },
    {
      id: 'auto-repair',
      name: 'Auto Repair',
      icon: Wrench,
      deals: [
        {
          title: 'Spring Maintenance Special',
          description: 'Free inspection with any service',
          discount: 'Free Inspection',
          validUntil: '2024-03-31',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Oil Change Package',
          description: 'Buy 3 oil changes, get 1 free',
          discount: 'B3G1',
          validUntil: '2024-04-05',
          category: 'bulk',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Car Care Workshop',
          description: 'Learn basic maintenance tips',
          date: '2024-03-28',
          time: '6:00 PM - 8:00 PM',
          location: 'Shop',
          category: 'workshop',
          attendees: 0,
          capacity: 20
        }
      ],
      bestPractices: [
        'Offer seasonal maintenance specials',
        'Create service packages for regular maintenance',
        'Host workshops to build trust and expertise',
        'Use social media to share maintenance tips'
      ]
    }
  ];

  const seasonalPromotions = [
    {
      id: 'spring',
      name: 'Spring Promotions',
      icon: Leaf,
      deals: [
        {
          title: 'Spring Cleaning Special',
          description: '20% off all cleaning services',
          discount: '20% OFF',
          validUntil: '2024-04-30',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Spring Refresh Package',
          description: 'Combo deal on spring services',
          discount: '25% OFF',
          validUntil: '2024-04-30',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Spring Open House',
          description: 'Celebrate the new season with special offers',
          date: '2024-04-15',
          time: '10:00 AM - 6:00 PM',
          location: 'Store',
          category: 'showcase',
          attendees: 0,
          capacity: 100
        }
      ]
    },
    {
      id: 'summer',
      name: 'Summer Promotions',
      icon: Sun,
      deals: [
        {
          title: 'Summer Savings',
          description: 'Special summer discounts',
          discount: '15% OFF',
          validUntil: '2024-08-31',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Summer Bundle',
          description: 'Combo deal on summer products',
          discount: '30% OFF',
          validUntil: '2024-08-31',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Summer Festival',
          description: 'Join us for summer celebrations',
          date: '2024-07-15',
          time: '11:00 AM - 8:00 PM',
          location: 'Store',
          category: 'showcase',
          attendees: 0,
          capacity: 150
        }
      ]
    },
    {
      id: 'holiday',
      name: 'Holiday Promotions',
      icon: Gift,
      deals: [
        {
          title: 'Holiday Special',
          description: 'Special holiday discounts',
          discount: '20% OFF',
          validUntil: '2024-12-31',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Gift Package',
          description: 'Curated holiday gift sets',
          discount: '25% OFF',
          validUntil: '2024-12-31',
          category: 'seasonal',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Holiday Open House',
          description: 'Celebrate the season with us',
          date: '2024-12-15',
          time: '10:00 AM - 8:00 PM',
          location: 'Store',
          category: 'showcase',
          attendees: 0,
          capacity: 200
        }
      ]
    }
  ];

  const creativeTemplates = [
    {
      id: 'gaming-cafe',
      name: 'Gaming Cafe',
      icon: Gamepad2,
      deals: [
        {
          title: 'Power Hour',
          description: 'Unlimited gaming with energy drinks included',
          discount: '25% OFF',
          validUntil: '2024-03-31',
          category: 'flash',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Tournament Pass',
          description: 'Access to all weekly tournaments',
          discount: '40% OFF',
          validUntil: '2024-04-05',
          category: 'monthly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Pro Gamer Meet & Greet',
          description: 'Meet professional gamers and learn their strategies',
          date: '2024-03-30',
          time: '6:00 PM - 9:00 PM',
          location: 'Cafe',
          category: 'showcase',
          attendees: 0,
          capacity: 50
        }
      ],
      bestPractices: [
        'Host regular tournaments to build community',
        'Create themed gaming nights',
        'Offer combo deals with food and gaming',
        'Partner with game developers for exclusive events'
      ]
    },
    {
      id: 'music-studio',
      name: 'Music Studio',
      icon: Music,
      deals: [
        {
          title: 'First Session Free',
          description: 'Try our recording studio with a professional engineer',
          discount: '100% OFF',
          validUntil: '2024-03-31',
          category: 'monthly',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Album Package',
          description: 'Complete album recording and mixing',
          discount: '30% OFF',
          validUntil: '2024-04-05',
          category: 'bulk',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Producer Workshop',
          description: 'Learn music production from industry professionals',
          date: '2024-04-02',
          time: '2:00 PM - 5:00 PM',
          location: 'Studio',
          category: 'workshop',
          attendees: 0,
          capacity: 15
        }
      ],
      bestPractices: [
        'Offer free first sessions to attract new artists',
        'Create package deals for full projects',
        'Host workshops to showcase expertise',
        'Build relationships with local artists'
      ]
    },
    {
      id: 'vr-arcade',
      name: 'VR Arcade',
      icon: Rocket,
      deals: [
        {
          title: 'VR Party Package',
          description: 'Group booking with refreshments included',
          discount: '20% OFF',
          validUntil: '2024-03-31',
          category: 'bulk',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Weekend Warrior',
          description: 'Unlimited VR access on weekends',
          discount: '35% OFF',
          validUntil: '2024-04-05',
          category: 'weekly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'VR Gaming Tournament',
          description: 'Compete in popular VR games for prizes',
          date: '2024-03-28',
          time: '6:00 PM - 10:00 PM',
          location: 'Arcade',
          category: 'tournament',
          attendees: 0,
          capacity: 30
        }
      ],
      bestPractices: [
        'Create themed VR experiences',
        'Host regular tournaments',
        'Offer group packages for events',
        'Keep equipment updated with latest games'
      ]
    },
    {
      id: 'escape-room',
      name: 'Escape Room',
      icon: Brain,
      deals: [
        {
          title: 'Team Building Package',
          description: 'Custom escape room experience for groups',
          discount: '25% OFF',
          validUntil: '2024-03-31',
          category: 'bulk',
          views: 0,
          redemptions: 0
        },
        {
          title: 'Mystery Night',
          description: 'Special themed escape room experience',
          discount: '15% OFF',
          validUntil: '2024-04-05',
          category: 'weekly',
          views: 0,
          redemptions: 0
        }
      ],
      events: [
        {
          title: 'Escape Room Design Workshop',
          description: 'Learn how to create your own escape room',
          date: '2024-04-01',
          time: '2:00 PM - 5:00 PM',
          location: 'Studio',
          category: 'workshop',
          attendees: 0,
          capacity: 20
        }
      ],
      bestPractices: [
        'Create unique themed rooms',
        'Offer corporate team building packages',
        'Host design workshops',
        'Regularly update room themes'
      ]
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);

  const applyTemplate = (template: typeof quickStartTemplates[0]) => {
    setDeals([...deals, ...template.deals]);
    setEvents([...events, ...template.events]);
    setSelectedTemplate(template.id);
  };

  const applySeasonalPromotion = (promotion: typeof seasonalPromotions[0]) => {
    setDeals([...deals, ...promotion.deals]);
    setEvents([...events, ...promotion.events]);
    setSelectedSeason(promotion.id);
  };

  const applyCreativeTemplate = (template: typeof creativeTemplates[0]) => {
    setDeals([...deals, ...template.deals]);
    setEvents([...events, ...template.events]);
    setSelectedCreative(template.id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Optimizer</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveCurrentFilters}>
            <Star className="h-4 w-4 mr-2" />
            Save Filters
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Quick Start Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {quickStartTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={cn(
                    "hover:shadow-lg transition-shadow",
                    selectedTemplate === template.id && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <template.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Best Practices</h4>
                            <ul className="text-sm space-y-1">
                              {template.bestPractices.map((practice, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Star className="h-3 w-3 mt-1 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Sample Deals:</h4>
                        <ul className="text-sm space-y-1">
                          {template.deals.map((deal, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              {deal.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sample Events:</h4>
                        <ul className="text-sm space-y-1">
                          {template.events.map((event, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {event.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => applyTemplate(template)}
                      >
                        Use This Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Seasonal Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {seasonalPromotions.map((promotion) => (
                <Card 
                  key={promotion.id} 
                  className={cn(
                    "hover:shadow-lg transition-shadow",
                    selectedSeason === promotion.id && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <promotion.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{promotion.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Seasonal Deals:</h4>
                        <ul className="text-sm space-y-1">
                          {promotion.deals.map((deal, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              {deal.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Seasonal Events:</h4>
                        <ul className="text-sm space-y-1">
                          {promotion.events.map((event, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {event.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => applySeasonalPromotion(promotion)}
                      >
                        Apply Seasonal Promotions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Creative Business Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {creativeTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={cn(
                    "hover:shadow-lg transition-shadow",
                    selectedCreative === template.id && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <template.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Best Practices</h4>
                            <ul className="text-sm space-y-1">
                              {template.bestPractices.map((practice, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Star className="h-3 w-3 mt-1 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Innovative Deals:</h4>
                        <ul className="text-sm space-y-1">
                          {template.deals.map((deal, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              {deal.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Unique Events:</h4>
                        <ul className="text-sm space-y-1">
                          {template.events.map((event, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {event.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => applyCreativeTemplate(template)}
                      >
                        Use This Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="deals" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="deals">Deals & Offers</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative w-[300px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="flash">Flash Sales</SelectItem>
                    <SelectItem value="weekly">Weekly Specials</SelectItem>
                    <SelectItem value="monthly">Monthly Bundles</SelectItem>
                    <SelectItem value="seasonal">Seasonal Offers</SelectItem>
                    <SelectItem value="bulk">Bulk Deals</SelectItem>
                    <SelectItem value="tasting">Tastings</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                    <SelectItem value="sale">Sales</SelectItem>
                    <SelectItem value="showcase">Showcases</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2 border-b">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('today')}>
                          Today
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('yesterday')}>
                          Yesterday
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('last7Days')}>
                          Last 7 Days
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('last30Days')}>
                          Last 30 Days
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('thisWeek')}>
                          This Week
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('lastWeek')}>
                          Last Week
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('nextWeek')}>
                          Next Week
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('thisMonth')}>
                          This Month
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('lastMonth')}>
                          Last Month
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('nextMonth')}>
                          Next Month
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyDatePreset('clear')}>
                          Clear
                        </Button>
                      </div>
                    </div>
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('popularThisWeek')}
                  className="flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Popular This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('endingSoon')}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-4 w-4" />
                  Ending Soon
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('newDeals')}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  New Deals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('upcomingEvents')}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  Upcoming Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('trendingDeals')}
                  className="flex items-center gap-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  Trending Deals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('highConversion')}
                  className="flex items-center gap-1"
                >
                  <Percent className="h-4 w-4" />
                  High Conversion
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('bestSellers')}
                  className="flex items-center gap-1"
                >
                  <DollarSign className="h-4 w-4" />
                  Best Sellers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterCombination('clearAll')}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {filterStats.filtered} of {filterStats.total} items</span>
                <Badge variant="secondary">{filterStats.percentage}%</Badge>
              </div>
            </div>

            {savedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={() => applySavedFilter(filter)}
                    className="flex items-center gap-1"
                  >
                    <Star className="h-4 w-4" />
                    {filter.name}
                  </Button>
                ))}
              </div>
            )}

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter.type)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <TabsContent value="deals">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedAndFilteredDeals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{deal.title}</CardTitle>
                        <Badge variant={deal.category === 'flash' ? 'destructive' : 'default'}>
                          {deal.category === 'flash' ? <Flame className="h-4 w-4 mr-1" /> : null}
                          {deal.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium">Views</div>
                          <div className="text-sm text-muted-foreground">{deal.views}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Redemptions</div>
                          <div className="text-sm text-muted-foreground">{deal.redemptions}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4" />
                          <span>{deal.discount}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valid until: {deal.validUntil}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1">Edit Deal</Button>
                        <Button variant="outline" className="flex-1">View Stats</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedAndFilteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant="default">
                          {event.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium">Attendees</div>
                          <div className="text-sm text-muted-foreground">{event.attendees}/{event.capacity}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Status</div>
                          <div className="text-sm text-muted-foreground">
                            {event.attendees >= event.capacity ? 'Full' : 'Open'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{event.date} at {event.time}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Location: {event.location}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1">Manage Event</Button>
                        <Button variant="outline" className="flex-1">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessOptimizer; 