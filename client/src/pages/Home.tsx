import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DealCard from "../components/DealCard";
import EventCard from "../components/EventCard";
import { Deal, Event } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Fetch featured deals
  const { data: featuredDeals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals?featured=true&limit=3"],
  });

  // Fetch featured events
  const { data: featuredEvents, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events?featured=true&limit=3"],
  });

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
              <a className="text-primary hover:text-opacity-80 font-medium flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
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
              <a className="text-primary hover:text-opacity-80 font-medium flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
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
            <Link href="/deals?category=food">
              <a className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-semibold">Food & Drink</h3>
                <p className="text-sm text-neutral-dark/70">42 deals</p>
              </a>
            </Link>
            
            <Link href="/deals?category=entertainment">
              <a className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Entertainment</h3>
                <p className="text-sm text-neutral-dark/70">28 deals</p>
              </a>
            </Link>
            
            <Link href="/deals?category=shopping">
              <a className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Shopping</h3>
                <p className="text-sm text-neutral-dark/70">36 deals</p>
              </a>
            </Link>
            
            <Link href="/deals?category=wellness">
              <a className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Wellness</h3>
                <p className="text-sm text-neutral-dark/70">19 deals</p>
              </a>
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
