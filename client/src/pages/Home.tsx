import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DealCard from "../components/DealCard";
import EventCard from "../components/EventCard";
import { Deal, Event } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getFeaturedDeals, getFeaturedEvents } from "../lib/firebase-service";

export default function Home() {
  // State for deals and events
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fetch featured deals from Firebase
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const deals = await getFeaturedDeals(3);
        setFeaturedDeals(deals);
        setDealsLoading(false);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setDealsLoading(false);
      }
    };
    
    fetchDeals();
  }, []);

  // Fetch featured events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getFeaturedEvents(3);
        setFeaturedEvents(events);
        setEventsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Discover South Africa's Best Deals & Events</h1>
            <p className="text-lg mb-8 opacity-90">From local favorites to popular hotspots, find the best South Africa has to offer</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/deals">
                <Button variant="default" className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-opacity-90 transition">
                  Browse Deals
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="default" className="bg-green-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-600 transition">
                  See Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        {/* Featured Deals Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Deals</h2>
            <Link href="/deals">
              <div className="text-primary hover:text-opacity-80 font-medium flex items-center cursor-pointer">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>
          
          {dealsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                  <div className="bg-gray-200 h-48 w-full rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals?.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>
        
        {/* Featured Events Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <div className="text-primary hover:text-opacity-80 font-medium flex items-center cursor-pointer">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>
          
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                  <div className="bg-gray-200 h-48 w-full rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
        
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/deals?category=braai">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-semibold">Braai & Shisanyama</h3>
                <p className="text-sm text-neutral-dark/70">12 deals</p>
              </div>
            </Link>
            
            <Link href="/deals?category=local">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-semibold">Local & Spaza</h3>
                <p className="text-sm text-neutral-dark/70">28 deals</p>
              </div>
            </Link>

            <Link href="/deals?category=entertainment">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Events & Lifestyle</h3>
                <p className="text-sm text-neutral-dark/70">36 deals</p>
              </div>
            </Link>

            <Link href="/deals?location=soweto">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Soweto Specials</h3>
                <p className="text-sm text-neutral-dark/70">19 deals</p>
              </div>
            </Link>
            
            <Link href="/deals?category=entertainment">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Entertainment</h3>
                <p className="text-sm text-neutral-dark/70">28 deals</p>
              </div>
            </Link>
            
            <Link href="/deals?category=shopping">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Shopping</h3>
                <p className="text-sm text-neutral-dark/70">36 deals</p>
              </div>
            </Link>
            
            <Link href="/deals?category=wellness">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Wellness</h3>
                <p className="text-sm text-neutral-dark/70">19 deals</p>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Merchant CTA */}
        <section className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl p-6 md:p-8">
          <div className="md:flex justify-between items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Are you a local South African business?</h2>
              <p className="text-neutral-dark/80">Join CityPulse to promote your deals and events to thousands of South African customers.</p>
            </div>
            <Link href="/merchant-login">
              <Button variant="default" className="block w-full md:w-auto text-center bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition font-semibold">
                Become a Merchant
              </Button>
            </Link>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}
