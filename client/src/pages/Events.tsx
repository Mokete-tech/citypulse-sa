import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Events() {
  // State for filters
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("soonest");
  
  // Fetch all events
  const { data: allEvents, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  // Get unique categories
  const categories = allEvents 
    ? [...new Set(allEvents.map(event => event.category))]
    : [];
  
  // Filter and sort events
  const filteredEvents = allEvents ? allEvents.filter(event => {
    // Filter by date if selected
    if (dateFilter) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const weekend = new Date();
      weekend.setDate(today.getDate() + (6 - today.getDay()));
      
      const eventDate = new Date(event.date);
      
      switch(dateFilter) {
        case "today":
          if (eventDate.toDateString() !== today.toDateString()) return false;
          break;
        case "tomorrow":
          if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
          break;
        case "weekend":
          const startWeekend = new Date();
          startWeekend.setDate(today.getDate() + (5 - today.getDay()));
          if (eventDate < startWeekend || eventDate > weekend) return false;
          break;
        case "next-week":
          const nextWeekStart = new Date();
          nextWeekStart.setDate(today.getDate() + (8 - today.getDay()));
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
          break;
        case "this-month":
          if (eventDate.getMonth() !== today.getMonth() || 
              eventDate.getFullYear() !== today.getFullYear()) return false;
          break;
      }
    }
    
    // Filter by category
    if (categoryFilter && event.category !== categoryFilter) {
      return false;
    }
    
    // Filter by search
    if (searchQuery && 
        !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on option
    switch(sortOption) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "price-low":
        // Simple price sorting logic
        const aPrice = a.price?.includes("FREE") ? 0 : parseInt(a.price?.replace(/\D/g, '') || "0");
        const bPrice = b.price?.includes("FREE") ? 0 : parseInt(b.price?.replace(/\D/g, '') || "0");
        return aPrice - bPrice;
      case "featured":
        // Featured events first, then by date
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "soonest":
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  }) : [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Events in South Africa</h1>
          
          {/* Date Filter */}
          <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
            <Button 
              variant={dateFilter === null ? "default" : "outline"} 
              className={dateFilter === null ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter(null)}>
              All Dates
            </Button>
            <Button 
              variant={dateFilter === "today" ? "default" : "outline"} 
              className={dateFilter === "today" ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter("today")}>
              Today
            </Button>
            <Button 
              variant={dateFilter === "tomorrow" ? "default" : "outline"} 
              className={dateFilter === "tomorrow" ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter("tomorrow")}>
              Tomorrow
            </Button>
            <Button 
              variant={dateFilter === "weekend" ? "default" : "outline"} 
              className={dateFilter === "weekend" ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter("weekend")}>
              This Weekend
            </Button>
            <Button 
              variant={dateFilter === "next-week" ? "default" : "outline"} 
              className={dateFilter === "next-week" ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter("next-week")}>
              Next Week
            </Button>
            <Button 
              variant={dateFilter === "this-month" ? "default" : "outline"} 
              className={dateFilter === "this-month" ? "bg-primary text-white whitespace-nowrap" : "whitespace-nowrap"}
              onClick={() => setDateFilter("this-month")}>
              This Month
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={categoryFilter === null ? "default" : "outline"} 
              className={categoryFilter === null ? "bg-primary text-white" : ""}
              onClick={() => setCategoryFilter(null)}>
              All Categories
            </Button>
            
            {categories.map(category => (
              <Button 
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                className={categoryFilter === category ? "bg-primary text-white" : ""}
                onClick={() => setCategoryFilter(category)}>
                {category}
              </Button>
            ))}
          </div>
          
          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pl-10 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select 
              className="bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="soonest">Sort: Date (Soonest)</option>
              <option value="latest">Sort: Date (Latest)</option>
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Sort: Price (Low to High)</option>
            </select>
          </div>
        </div>
        
        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-neutral-dark/70">Try adjusting your filters or search query</p>
          </div>
        )}
        
        {/* Pagination - Basic implementation */}
        {filteredEvents.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex space-x-2">
              <Button variant="outline" className="px-3 py-1 rounded bg-white text-neutral-dark border border-gray-200">
                Previous
              </Button>
              <Button variant="default" className="px-3 py-1 rounded bg-primary text-white">
                1
              </Button>
              <Button variant="outline" className="px-3 py-1 rounded bg-white text-neutral-dark border border-gray-200">
                2
              </Button>
              <Button variant="outline" className="px-3 py-1 rounded bg-white text-neutral-dark border border-gray-200">
                3
              </Button>
              <Button variant="outline" className="px-3 py-1 rounded bg-white text-neutral-dark border border-gray-200">
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
