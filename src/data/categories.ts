// Merchant categories data with count and icon information
export const merchantCategories = [
  // Food & Beverage
  { name: 'Restaurants', color: 'bg-amber-400', path: '/deals?category=restaurants', count: 18, icon: 'Utensils', group: 'Food & Beverage' },
  { name: 'Cafés & Bakeries', color: 'bg-amber-300', path: '/deals?category=cafes', count: 12, icon: 'Coffee', group: 'Food & Beverage' },
  { name: 'Bars & Nightlife', color: 'bg-amber-500', path: '/deals?category=bars', count: 9, icon: 'Wine', group: 'Food & Beverage' },
  { name: 'Fast Food', color: 'bg-amber-600', path: '/deals?category=fast-food', count: 14, icon: 'Pizza', group: 'Food & Beverage' },
  { name: 'Other Food & Drink', color: 'bg-amber-200', path: '/deals?category=other-food', count: 5, icon: 'Coffee', group: 'Food & Beverage' },

  // Shopping
  { name: 'Fashion & Apparel', color: 'bg-emerald-400', path: '/deals?category=fashion', count: 15, icon: 'ShoppingBag', group: 'Shopping' },
  { name: 'Electronics', color: 'bg-emerald-500', path: '/deals?category=electronics', count: 8, icon: 'Smartphone', group: 'Shopping' },
  { name: 'Home & Decor', color: 'bg-emerald-300', path: '/deals?category=home-decor', count: 7, icon: 'Home', group: 'Shopping' },
  { name: 'Gifts & Specialty', color: 'bg-emerald-600', path: '/deals?category=gifts', count: 5, icon: 'Gift', group: 'Shopping' },
  { name: 'Other Shopping', color: 'bg-emerald-200', path: '/deals?category=other-shopping', count: 6, icon: 'ShoppingBag', group: 'Shopping' },

  // Beauty & Wellness
  { name: 'Hair & Beauty', color: 'bg-pink-400', path: '/deals?category=hair-beauty', count: 11, icon: 'Scissors', group: 'Beauty & Wellness' },
  { name: 'Spas & Massage', color: 'bg-pink-300', path: '/deals?category=spas', count: 6, icon: 'Sparkles', group: 'Beauty & Wellness' },
  { name: 'Fitness & Gyms', color: 'bg-pink-500', path: '/deals?category=fitness', count: 8, icon: 'Dumbbell', group: 'Beauty & Wellness' },
  { name: 'Health & Wellness', color: 'bg-pink-600', path: '/deals?category=health', count: 9, icon: 'Heart', group: 'Beauty & Wellness' },
  { name: 'Other Beauty & Wellness', color: 'bg-pink-200', path: '/deals?category=other-beauty', count: 4, icon: 'Sparkles', group: 'Beauty & Wellness' },

  // Entertainment
  { name: 'Movies & Theater', color: 'bg-purple-400', path: '/deals?category=movies', count: 7, icon: 'Film', group: 'Entertainment' },
  { name: 'Gaming & Arcades', color: 'bg-purple-500', path: '/deals?category=gaming', count: 4, icon: 'Gamepad', group: 'Entertainment' },
  { name: 'Attractions', color: 'bg-purple-300', path: '/deals?category=attractions', count: 6, icon: 'Ticket', group: 'Entertainment' },
  { name: 'Nightclubs', color: 'bg-purple-600', path: '/deals?category=nightclubs', count: 5, icon: 'Music', group: 'Entertainment' },
  { name: 'Other Entertainment', color: 'bg-purple-200', path: '/deals?category=other-entertainment', count: 3, icon: 'Film', group: 'Entertainment' },

  // Travel & Transport
  { name: 'Hotels & Lodging', color: 'bg-blue-400', path: '/deals?category=hotels', count: 8, icon: 'Hotel', group: 'Travel & Transport' },
  { name: 'Travel Agencies', color: 'bg-blue-300', path: '/deals?category=travel-agencies', count: 4, icon: 'Plane', group: 'Travel & Transport' },
  { name: 'Car Rentals', color: 'bg-blue-500', path: '/deals?category=car-rentals', count: 3, icon: 'Car', group: 'Travel & Transport' },
  { name: 'Tours & Excursions', color: 'bg-blue-600', path: '/deals?category=tours', count: 5, icon: 'Map', group: 'Travel & Transport' },
  { name: 'Other Travel & Transport', color: 'bg-blue-200', path: '/deals?category=other-travel', count: 2, icon: 'Plane', group: 'Travel & Transport' },

  // Services
  { name: 'Professional Services', color: 'bg-gray-400', path: '/deals?category=professional', count: 6, icon: 'Briefcase', group: 'Services' },
  { name: 'Education & Tutoring', color: 'bg-gray-300', path: '/deals?category=education', count: 7, icon: 'GraduationCap', group: 'Services' },
  { name: 'Home Services', color: 'bg-gray-500', path: '/deals?category=home-services', count: 9, icon: 'Wrench', group: 'Services' },
  { name: 'Financial Services', color: 'bg-gray-600', path: '/deals?category=financial', count: 4, icon: 'Landmark', group: 'Services' },
  { name: 'Other Services', color: 'bg-gray-200', path: '/deals?category=other-services', count: 5, icon: 'Briefcase', group: 'Services' },

  // Other
  { name: 'Other Deals', color: 'bg-gray-400', path: '/deals?category=other', count: 10, icon: 'MoreHorizontal', group: 'Other' },
];

// Event types data with count and icon information
export const eventTypes = [
  // Music Events
  { name: 'Concerts', color: 'bg-red-400', path: '/events?category=concerts', count: 12, icon: 'Music', group: 'Music' },
  { name: 'Live Bands', color: 'bg-red-300', path: '/events?category=live-bands', count: 8, icon: 'Music', group: 'Music' },
  { name: 'Music Festivals', color: 'bg-red-500', path: '/events?category=music-festivals', count: 5, icon: 'Music', group: 'Music' },
  { name: 'DJ Events', color: 'bg-red-600', path: '/events?category=dj-events', count: 7, icon: 'Music', group: 'Music' },
  { name: 'Other Music Events', color: 'bg-red-200', path: '/events?category=other-music', count: 3, icon: 'Music', group: 'Music' },

  // Food & Shopping Events
  { name: 'Food Festivals', color: 'bg-yellow-400', path: '/events?category=food-festivals', count: 9, icon: 'Utensils', group: 'Food & Shopping' },
  { name: 'Farmers Markets', color: 'bg-yellow-300', path: '/events?category=farmers-markets', count: 6, icon: 'Apple', group: 'Food & Shopping' },
  { name: 'Pop-up Shops', color: 'bg-yellow-500', path: '/events?category=pop-up-shops', count: 4, icon: 'ShoppingBag', group: 'Food & Shopping' },
  { name: 'Food Tastings', color: 'bg-yellow-600', path: '/events?category=food-tastings', count: 5, icon: 'UtensilsCrossed', group: 'Food & Shopping' },
  { name: 'Other Food & Shopping Events', color: 'bg-yellow-200', path: '/events?category=other-food-shopping', count: 2, icon: 'ShoppingBag', group: 'Food & Shopping' },

  // Business & Networking
  { name: 'Conferences', color: 'bg-indigo-400', path: '/events?category=conferences', count: 7, icon: 'Users', group: 'Business & Networking' },
  { name: 'Workshops', color: 'bg-indigo-300', path: '/events?category=workshops', count: 10, icon: 'Lightbulb', group: 'Business & Networking' },
  { name: 'Networking Events', color: 'bg-indigo-500', path: '/events?category=networking', count: 8, icon: 'UserPlus', group: 'Business & Networking' },
  { name: 'Business Seminars', color: 'bg-indigo-600', path: '/events?category=business-seminars', count: 5, icon: 'Presentation', group: 'Business & Networking' },
  { name: 'Other Business Events', color: 'bg-indigo-200', path: '/events?category=other-business', count: 3, icon: 'Briefcase', group: 'Business & Networking' },

  // Sports & Activities
  { name: 'Sporting Events', color: 'bg-green-400', path: '/events?category=sporting-events', count: 11, icon: 'Trophy', group: 'Sports & Activities' },
  { name: 'Outdoor Activities', color: 'bg-green-300', path: '/events?category=outdoor-activities', count: 8, icon: 'Mountain', group: 'Sports & Activities' },
  { name: 'Fitness Classes', color: 'bg-green-500', path: '/events?category=fitness-classes', count: 9, icon: 'Dumbbell', group: 'Sports & Activities' },
  { name: 'Adventure Sports', color: 'bg-green-600', path: '/events?category=adventure-sports', count: 6, icon: 'Bike', group: 'Sports & Activities' },
  { name: 'Other Sports & Activities', color: 'bg-green-200', path: '/events?category=other-sports', count: 4, icon: 'Trophy', group: 'Sports & Activities' },

  // Arts & Culture
  { name: 'Art Exhibitions', color: 'bg-orange-400', path: '/events?category=art-exhibitions', count: 7, icon: 'Palette', group: 'Arts & Culture' },
  { name: 'Theater Shows', color: 'bg-orange-300', path: '/events?category=theater-shows', count: 5, icon: 'Theater', group: 'Arts & Culture' },
  { name: 'Cultural Festivals', color: 'bg-orange-500', path: '/events?category=cultural-festivals', count: 6, icon: 'Globe', group: 'Arts & Culture' },
  { name: 'Museum Events', color: 'bg-orange-600', path: '/events?category=museum-events', count: 4, icon: 'Building', group: 'Arts & Culture' },
  { name: 'Other Arts & Culture Events', color: 'bg-orange-200', path: '/events?category=other-arts', count: 3, icon: 'Palette', group: 'Arts & Culture' },

  // Family & Seasonal
  { name: 'Family Events', color: 'bg-sky-400', path: '/events?category=family-events', count: 8, icon: 'Users', group: 'Family & Seasonal' },
  { name: 'Kids Activities', color: 'bg-sky-300', path: '/events?category=kids-activities', count: 7, icon: 'Baby', group: 'Family & Seasonal' },
  { name: 'Holiday Events', color: 'bg-sky-500', path: '/events?category=holiday-events', count: 5, icon: 'CalendarDays', group: 'Family & Seasonal' },
  { name: 'Seasonal Celebrations', color: 'bg-sky-600', path: '/events?category=seasonal', count: 6, icon: 'Sparkles', group: 'Family & Seasonal' },
  { name: 'Other Family & Seasonal Events', color: 'bg-sky-200', path: '/events?category=other-family', count: 4, icon: 'Users', group: 'Family & Seasonal' },

  // Other
  { name: 'Other Events', color: 'bg-gray-400', path: '/events?category=other-events', count: 12, icon: 'MoreHorizontal', group: 'Other' },
];
