import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Deal, Event } from "@shared/schema";

// Sample data for development
const sampleDeals: Deal[] = [
  {
    id: 1,
    title: "50% Off Traditional Braai Platters",
    description: "Enjoy authentic South African braai with our special discount this month. Perfect for groups of 4 or more.",
    discount: "50",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    category: "Food & Drink",
    merchant: "Cape Town Grill",
    merchantId: "1",
    location: "45 Long Street, Cape Town",
    city: "Cape Town",
    featured: true,
    views: 120,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-08-15"),
    expirationDate: new Date("2023-12-31")
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free Safari Tour",
    description: "Experience the Big 5 with our special BOGO offer. Book one full-day safari and get a second ticket free.",
    discount: "50",
    imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    category: "Entertainment",
    merchant: "Kruger Adventures",
    merchantId: "2",
    location: "Kruger National Park",
    city: "Johannesburg",
    featured: true,
    views: 89,
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2023-08-10"),
    expirationDate: new Date("2023-11-30")
  },
  {
    id: 3,
    title: "30% Off All Protea Bouquets",
    description: "Celebrate South Africa's national flower with 30% off all protea arrangements and bouquets.",
    discount: "30",
    imageUrl: "https://images.unsplash.com/photo-1619544283142-2a44cde6b6f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80",
    category: "Shopping",
    merchant: "Protea Palace",
    merchantId: "3",
    location: "V&A Waterfront, Cape Town",
    city: "Cape Town",
    featured: false,
    views: 42,
    createdAt: new Date("2023-07-28"),
    updatedAt: new Date("2023-07-28"),
    expirationDate: new Date("2023-12-15")
  },
  {
    id: 4,
    title: "R200 Off Full Body Massage",
    description: "Relax and rejuvenate with our special offer on full body massages using indigenous African oils.",
    discount: "25",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Wellness",
    merchant: "Zulu Spa Retreat",
    merchantId: "4",
    location: "125 Florida Road, Durban",
    city: "Durban",
    featured: false,
    views: 67,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-08-01"),
    expirationDate: new Date("2023-10-31")
  },
  {
    id: 5,
    title: "15% Student Discount on Textbooks",
    description: "All university students get 15% off textbooks and academic resources with valid student ID.",
    discount: "15",
    imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Shopping",
    merchant: "Academic Books SA",
    merchantId: "5",
    location: "UCT Campus, Cape Town",
    city: "Cape Town",
    featured: false,
    views: 103,
    createdAt: new Date("2023-07-15"),
    updatedAt: new Date("2023-07-15"),
    expirationDate: new Date("2024-01-31")
  },
  {
    id: 6,
    title: "40% Off Wine Tasting Tours",
    description: "Sample the finest South African wines with our discounted tasting tour of Stellenbosch vineyards.",
    discount: "40",
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Food & Drink",
    merchant: "Winelands Explorer",
    merchantId: "6",
    location: "Stellenbosch",
    city: "Cape Town",
    featured: true,
    views: 156,
    createdAt: new Date("2023-08-05"),
    updatedAt: new Date("2023-08-05"),
    expirationDate: new Date("2023-11-15")
  }
];

const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Cape Town Jazz Festival",
    description: "South Africa's premier jazz festival featuring local and international artists across multiple stages.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Music",
    organizer: "Cape Town Events",
    organizerId: "1",
    location: "Cape Town International Convention Centre",
    city: "Cape Town",
    date: "2023-10-30",
    time: "18:00 - 23:00",
    price: "R450",
    featured: true,
    createdAt: new Date("2023-07-15"),
    updatedAt: new Date("2023-07-15")
  },
  {
    id: 2,
    title: "Soweto Food & Culture Festival",
    description: "Celebrate the rich culinary heritage of Soweto with food stalls, cooking demonstrations, and cultural performances.",
    imageUrl: "https://images.unsplash.com/photo-1577059013545-e2ee76e63239?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Food",
    organizer: "Soweto Tourism",
    organizerId: "2",
    location: "Soweto Theatre",
    city: "Johannesburg",
    date: "2023-11-12",
    time: "10:00 - 18:00",
    price: "R120",
    featured: true,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-08-01")
  },
  {
    id: 3,
    title: "Durban Indian Film Festival",
    description: "A showcase of the best in contemporary Indian cinema with screenings, director talks, and workshops.",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Film",
    organizer: "Durban Film Office",
    organizerId: "3",
    location: "Suncoast Casino",
    city: "Durban",
    date: "2023-11-25",
    time: "Various times",
    price: "R85 per screening",
    featured: false,
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2023-08-10")
  },
  {
    id: 4,
    title: "Pretoria Jacaranda Run",
    description: "10km fun run through Pretoria's jacaranda-lined streets when the purple blooms are at their peak.",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Sports",
    organizer: "Pretoria Athletics Club",
    organizerId: "4",
    location: "Union Buildings",
    city: "Pretoria",
    date: "2023-10-15",
    time: "07:00",
    price: "R150",
    featured: false,
    createdAt: new Date("2023-07-28"),
    updatedAt: new Date("2023-07-28")
  },
  {
    id: 5,
    title: "Robben Island Night Tour",
    description: "Special evening tour of Nelson Mandela's former prison with former political prisoners as guides.",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80",
    category: "History",
    organizer: "Robben Island Museum",
    organizerId: "5",
    location: "Robben Island",
    city: "Cape Town",
    date: "2023-12-05",
    time: "18:30 - 21:30",
    price: "R550",
    featured: true,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-08-15")
  },
  {
    id: 6,
    title: "Drakensberg Choir Festival",
    description: "A weekend of choral performances from South Africa's best choirs in the beautiful Drakensberg mountains.",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Music",
    organizer: "KZN Arts Council",
    organizerId: "6",
    location: "Champagne Sports Resort",
    city: "Drakensberg",
    date: "2023-11-18",
    time: "All day",
    price: "R300",
    featured: false,
    createdAt: new Date("2023-08-05"),
    updatedAt: new Date("2023-08-05")
  }
];

// Function to initialize sample data in Firestore
export async function initializeSampleData(): Promise<void> {
  try {
    // Check if deals collection exists and has data
    const dealsCollection = collection(db, "deals");
    const dealsSnapshot = await getDocs(dealsCollection);
    
    // If no deals exist, add sample deals
    if (dealsSnapshot.empty) {
      for (const deal of sampleDeals) {
        await addDoc(dealsCollection, {
          ...deal,
          createdAt: deal.createdAt,
          updatedAt: deal.updatedAt,
          expirationDate: deal.expirationDate
        });
      }
      console.log("Sample deals added to Firestore");
    }
    
    // Check if events collection exists and has data
    const eventsCollection = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsCollection);
    
    // If no events exist, add sample events
    if (eventsSnapshot.empty) {
      for (const event of sampleEvents) {
        await addDoc(eventsCollection, {
          ...event,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        });
      }
      console.log("Sample events added to Firestore");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

// Initialize sample data when this module is loaded
initializeSampleData();

// Deal Services
export async function getAllDeals(): Promise<Deal[]> {
  try {
    // First try to get deals from Firestore
    const dealsCollection = collection(db, "deals");
    const dealsSnapshot = await getDocs(dealsCollection);
    
    // If there are deals in Firestore, return them
    if (!dealsSnapshot.empty) {
      const dealsList = dealsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.data().id || parseInt(doc.id)
      })) as Deal[];
      return dealsList;
    }
    
    // Otherwise, return the sample deals
    console.log("Using sample deals data");
    return sampleDeals;
  } catch (error) {
    console.error("Error fetching deals:", error);
    // Return sample deals as fallback
    console.log("Using sample deals fallback data");
    return sampleDeals;
  }
}

export async function getFeaturedDeals(limitCount = 6): Promise<Deal[]> {
  try {
    // First try to get featured deals from Firestore
    const dealsCollection = collection(db, "deals");
    const featuredQuery = query(
      dealsCollection,
      where("featured", "==", true),
      limit(limitCount)
    );
    const dealsSnapshot = await getDocs(featuredQuery);
    
    // If there are featured deals in Firestore, return them
    if (!dealsSnapshot.empty) {
      const dealsList = dealsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.data().id || parseInt(doc.id)
      })) as Deal[];
      return dealsList;
    }
    
    // Otherwise, filter and return sample featured deals
    console.log("Using sample featured deals data");
    return sampleDeals
      .filter(deal => deal.featured)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching featured deals:", error);
    // Return sample featured deals as fallback
    console.log("Using sample featured deals fallback data");
    return sampleDeals
      .filter(deal => deal.featured)
      .slice(0, limitCount);
  }
}

export async function getDealsByMerchant(merchantId: string): Promise<Deal[]> {
  try {
    const dealsCollection = collection(db, "deals");
    const merchantQuery = query(
      dealsCollection,
      where("merchantId", "==", merchantId)
    );
    const dealsSnapshot = await getDocs(merchantQuery);
    const dealsList = dealsSnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    })) as Deal[];
    return dealsList;
  } catch (error) {
    console.error("Error fetching merchant deals:", error);
    return [];
  }
}

export async function getDealById(id: number): Promise<Deal | undefined> {
  try {
    // Try to get deal from Firestore
    const dealQuery = query(collection(db, "deals"), where("id", "==", id));
    const dealSnap = await getDocs(dealQuery);
    
    // If deal exists in Firestore, return it
    if (!dealSnap.empty) {
      return { id, ...dealSnap.docs[0].data() } as Deal;
    }
    
    // Otherwise, find deal in sample data
    console.log("Using sample deal data");
    return sampleDeals.find(deal => deal.id === id);
  } catch (error) {
    console.error("Error fetching deal:", error);
    // Return sample deal as fallback
    console.log("Using sample deals fallback data");
    return sampleDeals.find(deal => deal.id === id);
  }
}

export async function createDeal(deal: Partial<Deal>): Promise<Deal> {
  try {
    // Get the latest ID by querying all deals ordered by ID in descending order
    const dealsCollection = collection(db, "deals");
    const lastDealQuery = query(dealsCollection, orderBy("id", "desc"), limit(1));
    const lastDealSnapshot = await getDocs(lastDealQuery);
    
    let newId = 1;
    if (!lastDealSnapshot.empty) {
      const lastDeal = lastDealSnapshot.docs[0].data() as Deal;
      newId = lastDeal.id + 1;
    }
    
    const newDeal = {
      ...deal,
      id: newId,
      createdAt: serverTimestamp() as unknown as Date,
      updatedAt: serverTimestamp() as unknown as Date,
      views: 0
    };
    
    await addDoc(collection(db, "deals"), newDeal);
    return newDeal as Deal;
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
}

export async function updateDeal(id: number, deal: Partial<Deal>): Promise<Deal | undefined> {
  try {
    const dealQuery = query(collection(db, "deals"), where("id", "==", id));
    const dealSnap = await getDocs(dealQuery);
    
    if (dealSnap.empty) return undefined;
    
    const dealDocRef = doc(db, "deals", dealSnap.docs[0].id);
    const updatedDeal = {
      ...deal,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(dealDocRef, updatedDeal);
    return { id, ...dealSnap.docs[0].data(), ...updatedDeal } as Deal;
  } catch (error) {
    console.error("Error updating deal:", error);
    return undefined;
  }
}

export async function deleteDeal(id: number): Promise<boolean> {
  try {
    const dealQuery = query(collection(db, "deals"), where("id", "==", id));
    const dealSnap = await getDocs(dealQuery);
    
    if (dealSnap.empty) return false;
    
    const dealDocRef = doc(db, "deals", dealSnap.docs[0].id);
    await deleteDoc(dealDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting deal:", error);
    return false;
  }
}

export async function incrementDealViews(id: number): Promise<void> {
  try {
    const dealQuery = query(collection(db, "deals"), where("id", "==", id));
    const dealSnap = await getDocs(dealQuery);
    
    if (!dealSnap.empty) {
      const dealDocRef = doc(db, "deals", dealSnap.docs[0].id);
      const dealData = dealSnap.docs[0].data() as Deal;
      
      await updateDoc(dealDocRef, {
        views: (dealData.views || 0) + 1
      });
    }
  } catch (error) {
    console.error("Error incrementing deal views:", error);
  }
}

// Event Services
export async function getAllEvents(): Promise<Event[]> {
  try {
    // First try to get events from Firestore
    const eventsCollection = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsCollection);
    
    // If there are events in Firestore, return them
    if (!eventsSnapshot.empty) {
      const eventsList = eventsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.data().id || parseInt(doc.id)
      })) as Event[];
      return eventsList;
    }
    
    // Otherwise, return the sample events
    console.log("Using sample events data");
    return sampleEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return sample events as fallback
    console.log("Using sample events fallback data");
    return sampleEvents;
  }
}

export async function getFeaturedEvents(limitCount = 6): Promise<Event[]> {
  try {
    // First try to get featured events from Firestore
    const eventsCollection = collection(db, "events");
    const featuredQuery = query(
      eventsCollection,
      where("featured", "==", true),
      limit(limitCount)
    );
    const eventsSnapshot = await getDocs(featuredQuery);
    
    // If there are featured events in Firestore, return them
    if (!eventsSnapshot.empty) {
      const eventsList = eventsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.data().id || parseInt(doc.id)
      })) as Event[];
      return eventsList;
    }
    
    // Otherwise, filter and return sample featured events
    console.log("Using sample featured events data");
    return sampleEvents
      .filter(event => event.featured)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    // Return sample featured events as fallback
    console.log("Using sample featured events fallback data");
    return sampleEvents
      .filter(event => event.featured)
      .slice(0, limitCount);
  }
}

export async function getEventById(id: number): Promise<Event | undefined> {
  try {
    // Try to get event from Firestore
    const eventQuery = query(collection(db, "events"), where("id", "==", id));
    const eventSnap = await getDocs(eventQuery);
    
    // If event exists in Firestore, return it
    if (!eventSnap.empty) {
      return { id, ...eventSnap.docs[0].data() } as Event;
    }
    
    // Otherwise, find event in sample data
    console.log("Using sample event data");
    return sampleEvents.find(event => event.id === id);
  } catch (error) {
    console.error("Error fetching event:", error);
    // Return sample event as fallback
    console.log("Using sample events fallback data");
    return sampleEvents.find(event => event.id === id);
  }
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
  try {
    // Get the latest ID by querying all events ordered by ID in descending order
    const eventsCollection = collection(db, "events");
    const lastEventQuery = query(eventsCollection, orderBy("id", "desc"), limit(1));
    const lastEventSnapshot = await getDocs(lastEventQuery);
    
    let newId = 1;
    if (!lastEventSnapshot.empty) {
      const lastEvent = lastEventSnapshot.docs[0].data() as Event;
      newId = lastEvent.id + 1;
    }
    
    const newEvent = {
      ...event,
      id: newId,
      createdAt: serverTimestamp() as unknown as Date,
      updatedAt: serverTimestamp() as unknown as Date
    };
    
    await addDoc(collection(db, "events"), newEvent);
    return newEvent as Event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined> {
  try {
    const eventQuery = query(collection(db, "events"), where("id", "==", id));
    const eventSnap = await getDocs(eventQuery);
    
    if (eventSnap.empty) return undefined;
    
    const eventDocRef = doc(db, "events", eventSnap.docs[0].id);
    const updatedEvent = {
      ...event,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(eventDocRef, updatedEvent);
    return { id, ...eventSnap.docs[0].data(), ...updatedEvent } as Event;
  } catch (error) {
    console.error("Error updating event:", error);
    return undefined;
  }
}

export async function deleteEvent(id: number): Promise<boolean> {
  try {
    const eventQuery = query(collection(db, "events"), where("id", "==", id));
    const eventSnap = await getDocs(eventQuery);
    
    if (eventSnap.empty) return false;
    
    const eventDocRef = doc(db, "events", eventSnap.docs[0].id);
    await deleteDoc(eventDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}