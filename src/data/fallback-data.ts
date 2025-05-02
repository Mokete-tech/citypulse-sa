/**
 * This file contains fallback data to be used when API calls fail
 * or when in development mode without a backend connection.
 */

export interface Deal {
  id: number;
  title: string;
  description: string;
  category?: string;
  image_url?: string;
  discount?: string;
  merchant_name?: string;
  expiration_date?: string;
  location?: string;
  featured?: boolean;
  views?: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category?: string;
  image_url?: string;
  price?: string;
  merchant_name?: string;
  featured?: boolean;
  views?: number;
}

export const fallbackDeals: Deal[] = [
  {
    id: 1,
    title: "20% Off All Coffee",
    description: "Get 20% off any coffee drink, every Tuesday",
    category: "Food & Drink",
    expiration_date: "2025-05-15",
    merchant_name: "Cape Town Café",
    discount: "20%",
    location: "Cape Town",
    featured: true,
    views: 245
  },
  {
    id: 2,
    title: "Buy One Get One Free",
    description: "Buy one book, get one free of equal or lesser value",
    category: "Retail",
    expiration_date: "2025-05-20",
    merchant_name: "Johannesburg Books",
    discount: "BOGO",
    location: "Johannesburg",
    featured: false,
    views: 187
  },
  {
    id: 3,
    title: "30% Off First Visit",
    description: "New customers get 30% off their first service",
    category: "Beauty",
    expiration_date: "2025-06-01",
    merchant_name: "Durban Spa & Salon",
    discount: "30%",
    location: "Durban",
    featured: true,
    views: 312
  }
];

export const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Jazz Night at V&A Waterfront",
    description: "Join us for a night of live jazz music with local artists",
    date: "2025-05-10",
    time: "7:00 PM",
    location: "Cape Town Waterfront",
    category: "Music",
    price: "R150",
    featured: true,
    views: 189,
    merchant_name: "V&A Waterfront Events"
  },
  {
    id: 2,
    title: "Farmers Market",
    description: "Fresh local produce, handcrafted goods, and live music",
    date: "2025-05-17",
    time: "9:00 AM",
    location: "Neighbourgoods Market, Johannesburg",
    category: "Food & Shopping",
    price: "Free",
    featured: false,
    views: 142,
    merchant_name: "Neighbourgoods Market"
  },
  {
    id: 3,
    title: "Tech Meetup",
    description: "Networking event for tech professionals and enthusiasts",
    date: "2025-05-22",
    time: "6:30 PM",
    location: "Durban Digital Hub",
    category: "Networking",
    price: "R50",
    featured: true,
    views: 278,
    merchant_name: "Durban Tech Community"
  }
];

export const fallbackMerchantDeals: Deal[] = [
  {
    id: 1,
    title: "20% Off All Coffee",
    description: "Get 20% off any coffee drink, every Tuesday",
    expiration_date: "2025-05-15",
    category: "Food & Drink",
    location: "Cape Town Café",
    discount: "20%",
    featured: true,
    views: 245,
    merchant_name: "Cape Town Café"
  },
  {
    id: 2,
    title: "Buy One Get One Free",
    description: "Buy one book, get one free of equal or lesser value",
    expiration_date: "2025-05-20",
    category: "Retail",
    location: "Johannesburg Books",
    discount: "BOGO",
    featured: false,
    views: 187,
    merchant_name: "Johannesburg Books"
  },
  {
    id: 3,
    title: "30% Off First Visit",
    description: "New customers get 30% off their first service",
    expiration_date: "2025-06-01",
    category: "Beauty",
    location: "Durban Spa & Salon",
    discount: "30%",
    featured: true,
    views: 312,
    merchant_name: "Durban Spa & Salon"
  }
];
