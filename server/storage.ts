import { users, type User, type InsertUser, deals, type Deal, type InsertDeal, events, type Event, type InsertEvent } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllDeals(): Promise<Deal[]>;
  getFeaturedDeals(limit?: number): Promise<Deal[]>;
  getDealsByMerchant(merchantId: string): Promise<Deal[]>;
  getDealById(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  incrementDealViews(id: number): Promise<void>;
  
  getAllEvents(): Promise<Event[]>;
  getFeaturedEvents(limit?: number): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private deals: Map<number, Deal>;
  private events: Map<number, Event>;
  private currentUserId: number;
  private currentDealId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.deals = new Map();
    this.events = new Map();
    this.currentUserId = 1;
    this.currentDealId = 1;
    this.currentEventId = 1;
    
    // Add sample merchant user
    this.createUser({
      username: "testmerchant",
      password: "password123",
      email: "test@merchant.com",
      merchantName: "Cape Town Coffee Co.",
      merchantId: "m1"
    });
    
    // Add sample deals
    this.createDeal({
      title: "Morning Brew Coffee",
      description: "Start your day with our artisan coffee. 20% off any drink before 11am.",
      discount: "20",
      category: "Café & Restaurant",
      merchantId: "m1",
      merchantName: "Cape Town Coffee Co.",
      expirationDate: "2023-05-25",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
    });
    
    this.createDeal({
      title: "Cape Town Seafood Grill",
      description: "Fresh seafood with an ocean view. 10% off your total bill on weekdays.",
      discount: "10",
      category: "Restaurant",
      merchantId: "m1",
      merchantName: "Cape Town Coffee Co.",
      expirationDate: "2023-06-30",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd"
    });
    
    this.createDeal({
      title: "Durban Wellness Spa",
      description: "First-time customers receive 30% off any massage treatment.",
      discount: "30",
      category: "Wellness & Spa",
      merchantId: "m1",
      merchantName: "Cape Town Coffee Co.",
      expirationDate: "2023-05-25",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db"
    });
    
    // Add sample events
    this.createEvent({
      title: "Jazz Night at Long Street Lounge",
      description: "Live jazz music featuring the Cape Town Jazz Quartet. Food and drinks available.",
      category: "Music & Nightlife",
      date: "May 15, 2023",
      time: "8:00 PM",
      location: "Long Street Lounge, Cape Town",
      price: "FREE ENTRY",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
    });
    
    this.createEvent({
      title: "Neighbourgoods Market",
      description: "Local produce, crafts, and food vendors. Family-friendly with activities for kids.",
      category: "Food & Community",
      date: "May 14, 2023",
      time: "9:00 AM",
      location: "Woodstock, Cape Town",
      price: "FREE ENTRY",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1577368499727-28d788ae5fc5"
    });
    
    this.createEvent({
      title: "African Pottery Workshop",
      description: "Learn traditional South African pottery techniques from master potter Thandi Mkhize. All materials provided.",
      category: "Arts & Culture",
      date: "May 18, 2023",
      time: "6:30 PM",
      location: "Johannesburg Art Studio",
      price: "R450 PER PERSON",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }
  
  async getFeaturedDeals(limit?: number): Promise<Deal[]> {
    const featuredDeals = Array.from(this.deals.values())
      .filter(deal => deal.featured);
    
    return limit ? featuredDeals.slice(0, limit) : featuredDeals;
  }
  
  async getDealsByMerchant(merchantId: string): Promise<Deal[]> {
    return Array.from(this.deals.values())
      .filter(deal => deal.merchantId === merchantId);
  }
  
  async getDealById(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }
  
  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = this.currentDealId++;
    const newDeal: Deal = { 
      ...deal, 
      id, 
      views: 0,
      createdAt: new Date()
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }
  
  async updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal | undefined> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) return undefined;
    
    const updatedDeal = { ...existingDeal, ...deal };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  async deleteDeal(id: number): Promise<boolean> {
    return this.deals.delete(id);
  }
  
  async incrementDealViews(id: number): Promise<void> {
    const deal = this.deals.get(id);
    if (deal) {
      deal.views += 1;
      this.deals.set(id, deal);
    }
  }
  
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getFeaturedEvents(limit?: number): Promise<Event[]> {
    const featuredEvents = Array.from(this.events.values())
      .filter(event => event.featured);
    
    return limit ? featuredEvents.slice(0, limit) : featuredEvents;
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const newEvent: Event = { 
      ...event, 
      id,
      createdAt: new Date()
    };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
