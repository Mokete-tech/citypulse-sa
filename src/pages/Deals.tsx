
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Food & Drink", "Retail", "Beauty", "Entertainment", "Health & Fitness", "Travel"];

  const allDeals = [
    {
      title: "50% Off Gourmet Burgers",
      category: "Food & Drink",
      business: "The Burger Joint",
      description: "Enjoy our premium beef burgers with artisanal toppings at half price! Made with locally sourced ingredients.",
      discount: "50% OFF",
      rating: 4.8,
      expires: "2024-12-31",
      featured: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop"
    },
    {
      title: "Buy 2 Get 1 Free Coffee",
      category: "Food & Drink", 
      business: "Cape Town Coffee Co",
      description: "Perfect morning deal for coffee lovers. Premium roasted beans from local South African farms.",
      discount: "Buy 2 Get 1",
      rating: 4.7,
      expires: "2024-12-25",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop"
    },
    {
      title: "30% Off Designer Clothing",
      category: "Retail",
      business: "Fashion Forward", 
      description: "Latest fashion trends at unbeatable prices. Limited time offer on all designer collections.",
      discount: "30% OFF",
      rating: 4.6,
      expires: "2024-12-20",
      featured: true,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop"
    },
    {
      title: "Free Spa Treatment",
      category: "Beauty",
      business: "Serenity Spa",
      description: "Complimentary 60-minute massage with any facial treatment. Relax and rejuvenate in luxury.",
      discount: "Free Treatment",
      rating: 4.9,
      expires: "2024-12-28",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=300&fit=crop"
    },
    {
      title: "Movie Night Special",
      category: "Entertainment",
      business: "Cinema City",
      description: "Two tickets for the price of one every Tuesday night. Includes popcorn and drinks.",
      discount: "2 for 1",
      rating: 4.5,
      expires: "2024-12-31",
      featured: true,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=300&fit=crop"
    },
    {
      title: "Wine Tasting Experience",
      category: "Food & Drink",
      business: "Stellenbosch Winery",
      description: "Sample premium South African wines with expert sommelier guidance. Includes cheese pairings.",
      discount: "40% OFF",
      rating: 4.8,
      expires: "2024-12-30",
      image: "https://images.unsplash.com/photo-1506377872008-6645d6ba8e83?w=500&h=300&fit=crop"
    },
    {
      title: "Gym Membership Special",
      category: "Health & Fitness",
      business: "FitLife Gym",
      description: "3 months membership for the price of 2. Includes personal training session and nutrition consultation.",
      discount: "33% OFF",
      rating: 4.4,
      expires: "2024-12-15",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
    },
    {
      title: "Weekend Getaway Package",
      category: "Travel",
      business: "Mountain Lodge Resort",
      description: "2-night stay with breakfast included. Experience the beauty of the Drakensberg Mountains.",
      discount: "25% OFF",
      rating: 4.7,
      expires: "2024-12-22",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop"
    }
  ];

  const filteredDeals = allDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingDeals = allDeals.filter(deal => deal.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Deals</h1>
            <p className="text-xl text-gray-600 mb-6">Explore all the best deals across South Africa.</p>
            
            {/* Featured Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{allDeals.length}</div>
                <div className="text-sm text-gray-600">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{trendingDeals.length}</div>
                <div className="text-sm text-gray-600">Featured Today</div>
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
                placeholder="Search deals by name, business, or location..."
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
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      {trendingDeals.length > 0 && (
        <section className="py-8 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Trending Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingDeals.slice(0, 3).map((deal, index) => (
                <DealCard key={`trending-${index}`} {...deal} />
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
          
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal, index) => (
                <DealCard key={index} {...deal} />
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

      {/* Location-based Deals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            Popular Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Polokwane"].map(city => (
              <Button key={city} variant="outline" className="p-4 h-auto hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="font-medium">{city}</div>
                  <div className="text-sm text-gray-600">{Math.floor(Math.random() * 100) + 20} deals</div>
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
