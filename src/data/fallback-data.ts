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
  event_date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  venue?: string;
  category?: string;
  image_url?: string;
  ticket_price?: string;
  ticket_url?: string;
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
    description: "Join us for a night of live jazz music with local artists. Featuring some of South Africa's top jazz musicians, this event promises an unforgettable evening of smooth melodies and vibrant rhythms. Refreshments will be available for purchase.",
    event_date: "2025-05-10",
    start_time: "19:00",
    end_time: "22:00",
    location: "Cape Town",
    venue: "V&A Waterfront Amphitheatre",
    category: "Music",
    image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    ticket_price: "R150",
    ticket_url: "https://tickets.example.com/jazz-night",
    featured: true,
    views: 189,
    merchant_name: "V&A Waterfront Events"
  },
  {
    id: 2,
    title: "Farmers Market",
    description: "Fresh local produce, handcrafted goods, and live music. Support local farmers and artisans while enjoying a day out with family and friends. This weekly market features over 50 vendors offering everything from organic vegetables to handmade jewelry.",
    event_date: "2025-05-17",
    start_time: "09:00",
    end_time: "14:00",
    location: "Johannesburg",
    venue: "Neighbourgoods Market",
    category: "Food & Shopping",
    image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
    ticket_price: "Free",
    featured: false,
    views: 142,
    merchant_name: "Neighbourgoods Market"
  },
  {
    id: 3,
    title: "Tech Meetup",
    description: "Networking event for tech professionals and enthusiasts. Connect with like-minded individuals, share ideas, and learn about the latest trends in technology. The event will include lightning talks, panel discussions, and plenty of networking opportunities.",
    event_date: "2025-05-22",
    start_time: "18:30",
    end_time: "21:00",
    location: "Durban",
    venue: "Durban Digital Hub",
    category: "Networking",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    ticket_price: "R50",
    ticket_url: "https://tickets.example.com/tech-meetup",
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
