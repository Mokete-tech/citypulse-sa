import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DealCard from "../components/DealCard";
import { Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAllDeals } from "../lib/firebase-service";

export default function Deals() {
  // State for deals and loading
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [location] = useLocation();
  
  // Fetch all deals from Firebase
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const deals = await getAllDeals();
        setAllDeals(deals);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setIsLoading(false);
      }
    };
    
    fetchDeals();
  }, []);
  
  // Process URL query parameters
  useEffect(() => {
    // Get search params from the URL
    const url = new URL(window.location.href);
    const searchParam = url.searchParams.get("search");
    const categoryParam = url.searchParams.get("category");
    
    // Set search query from URL if exists
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // Set category from URL if exists
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location]);
  
  // Filter and sort deals
  const filteredDeals = allDeals ? allDeals.filter(deal => {
    // Filter by category if one is selected
    if (activeCategory && deal.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query (title, description or city)
    if (searchQuery && 
        !deal.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !deal.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !deal.city?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on selected option
    switch(sortOption) {
      case "newest":
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      case "expiring":
        return new Date(a.expirationDate || Date.now()).getTime() - new Date(b.expirationDate || Date.now()).getTime();
      case "discount":
        // Simple sort by discount percentage 
        // (would need more complex parsing for accurate sorting)
        const aDiscount = parseInt(a.discount) || 0;
        const bDiscount = parseInt(b.discount) || 0;
        return bDiscount - aDiscount;
      case "featured":
      default:
        // Featured at top, then newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
    }
  }) : [];
  
  // Get unique categories
  const categoriesSet = new Set<string>();
  if (allDeals) {
    allDeals.forEach(deal => {
      if (deal.category) categoriesSet.add(deal.category);
    });
  }
  const categories = Array.from(categoriesSet);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Deals in South Africa</h1>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeCategory === null ? "default" : "outline"} 
              className={activeCategory === null ? "bg-primary text-white" : ""}
              onClick={() => setActiveCategory(null)}>
              All Deals
            </Button>
            
            {categories.map(category => (
              <Button 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={activeCategory === category ? "bg-primary text-white" : ""}
                onClick={() => setActiveCategory(category)}>
                {category}
              </Button>
            ))}
          </div>
          
          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search deals..."
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
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="expiring">Sort: Expiring Soon</option>
              <option value="discount">Sort: Highest Discount</option>
            </select>
          </div>
        </div>
        
        {/* Deals Grid */}
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
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-neutral-dark/70">Try adjusting your filters or search query</p>
          </div>
        )}
        
        {/* Pagination - Basic implementation */}
        {filteredDeals.length > 0 && (
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
