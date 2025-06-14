
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import LocationSelector from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, TrendingUp, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useDeals } from "@/hooks/useDeals";
import { useLocation } from "@/hooks/useLocation";

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { location } = useLocation();

  const categories = ["All", "Food & Drink", "Retail", "Beauty", "Entertainment", "Health & Fitness", "Travel"];

  const { data: deals = [], isLoading, error } = useDeals(selectedCategory, searchTerm);

  const featuredDeals = deals.filter(deal => deal.featured);
  const retailDeals = deals.filter(deal => deal.category === 'retail');
  const filteredDeals = deals;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Deals</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Deals</h1>
            <p className="text-xl text-gray-600 mb-6">
              Explore all the best deals across South Africa - from grocery stores to retail outlets.
              {location && (
                <span className="block mt-2 text-blue-600">
                  Showing deals near {location.city}, {location.province}
                </span>
              )}
            </p>
            
            {/* Location Selector */}
            <div className="flex justify-center mb-6">
              <LocationSelector />
            </div>
            
            {/* Featured Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{deals.length}</div>
                <div className="text-sm text-gray-600">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{retailDeals.length}</div>
                <div className="text-sm text-gray-600">Retail & Grocery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">R2,500</div>
                <div className="text-sm text-gray-600">Avg. Savings</div>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search deals by name, business, or location (e.g., Shoprite, groceries)..."
                className="pl-10 py-3 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "Retail" && <ShoppingCart className="w-3 h-3 mr-1" />}
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Grocery & Retail Spotlight */}
      <section className="py-8 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
            Grocery & Retail Deals
            {location && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                in {location.city}
              </span>
            )}
          </h2>
          <p className="text-gray-600 mb-6">Find the best deals at South Africa's top retailers including Shoprite, Pick n Pay, Woolworths, and more!</p>
          
          {retailDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {retailDeals.slice(0, 3).map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">More Retail Deals Coming Soon!</h3>
              <p className="text-gray-600 mb-4">We're adding grocery and retail deals from Shoprite, Pick n Pay, Woolworths, and other popular stores.</p>
              <Button onClick={() => setSelectedCategory("All")} variant="outline">
                View All Available Deals
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trending Deals */}
      {featuredDeals.length > 0 && (
        <section className="py-8 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Trending Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredDeals.slice(0, 3).map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Deals Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "All" ? "All Deals" : `${selectedCategory} Deals`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading deals...</div>
            </div>
          ) : filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No deals found matching your criteria</div>
              <Button onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Stores */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            Popular Stores & Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Shoprite", deals: Math.floor(Math.random() * 20) + 15 },
              { name: "Pick n Pay", deals: Math.floor(Math.random() * 18) + 12 },
              { name: "Woolworths", deals: Math.floor(Math.random() * 15) + 10 },
              { name: "Checkers", deals: Math.floor(Math.random() * 16) + 8 },
              { name: "Cape Town", deals: Math.floor(Math.random() * 100) + 50 },
              { name: "Johannesburg", deals: Math.floor(Math.random() * 120) + 60 },
              { name: "Durban", deals: Math.floor(Math.random() * 80) + 40 },
              { name: "Pretoria", deals: Math.floor(Math.random() * 70) + 35 }
            ].map(store => (
              <Button 
                key={store.name} 
                variant="outline" 
                className="p-4 h-auto hover:scale-105 transition-transform"
                onClick={() => setSearchTerm(store.name)}
              >
                <div className="text-center">
                  <div className="font-medium">{store.name}</div>
                  <div className="text-sm text-gray-600">{store.deals} deals</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Deals;
