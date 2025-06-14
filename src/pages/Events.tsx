
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Music", "Food & Drink", "Arts & Culture", "Sports", "Business", "Entertainment", "Education"];

  const allEvents = [
    {
      title: "Summer Music Festival",
      category: "Music",
      organizer: "Event Organizers SA",
      description: "Three days of amazing live music featuring local and international artists. Food trucks, craft beer, and family-friendly activities.",
      date: "2024-12-15",
      time: "18:00",
      venue: "Cape Town Stadium",
      price: "R350",
      rating: 4.9,
      premium: true,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop"
    },
    {
      title: "Food & Wine Tasting", 
      category: "Food & Drink",
      organizer: "Gourmet Events",
      description: "Experience the best of South African cuisine paired with premium wines from local vineyards. Meet renowned chefs and winemakers.",
      date: "2024-12-18",
      time: "19:00", 
      venue: "V&A Waterfront",
      price: "R450",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop"
    },
    {
      title: "Business Networking Evening",
      category: "Business",
      organizer: "Business Network SA",
      description: "Connect with entrepreneurs and business leaders in Cape Town. Includes keynote speakers and networking dinner.",
      date: "2024-12-20",
      time: "17:30",
      venue: "Century City Conference Centre", 
      price: "R150",
      rating: 4.6,
      premium: true,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop"
    },
    {
      title: "Rugby Championship",
      category: "Sports",
      organizer: "Sports SA",
      description: "Local teams compete in this exciting rugby tournament. Family-friendly event with food stalls and entertainment.",
      date: "2024-12-22",
      time: "15:00",
      venue: "Newlands Rugby Ground",
      price: "R80",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop"
    },
    {
      title: "Art Gallery Opening",
      category: "Arts & Culture",
      organizer: "Modern Art Gallery",
      description: "Discover contemporary South African art at this exclusive opening. Meet the artists and enjoy wine and canapés.",
      date: "2024-12-25",
      time: "18:30",
      venue: "Zeitz Museum",
      price: "Free",
      rating: 4.7,
      premium: true,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop"
    },
    {
      title: "Outdoor Adventure Race",
      category: "Sports",
      organizer: "Adventure Sports SA",
      description: "Challenge yourself in this exciting outdoor adventure race through the beautiful Western Cape mountains.",
      date: "2024-12-28",
      time: "08:00",
      venue: "Table Mountain National Park",
      price: "R200",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop"
    },
    {
      title: "Comedy Night",
      category: "Entertainment",
      organizer: "Laugh Out Loud Productions",
      description: "An evening of hilarious stand-up comedy featuring South Africa's funniest comedians.",
      date: "2024-12-19",
      time: "20:00",
      venue: "Baxter Theatre",
      price: "R120",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=300&fit=crop"
    },
    {
      title: "Tech Conference 2024",
      category: "Education",
      organizer: "Tech Leaders SA",
      description: "Learn about the latest technology trends and innovations. Featuring keynote speakers from leading tech companies.",
      date: "2024-12-30",
      time: "09:00",
      venue: "Cape Town International Convention Centre",
      price: "R800",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop"
    }
  ];

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const premiumEvents = allEvents.filter(event => event.premium);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Events</h1>
            <p className="text-xl text-gray-600 mb-6">Discover all upcoming events across South Africa.</p>
            
            {/* Featured Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{allEvents.length}</div>
                <div className="text-sm text-gray-600">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{premiumEvents.length}</div>
                <div className="text-sm text-gray-600">Premium Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search events by name, organizer, or venue..."
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

      {/* Premium Events */}
      {premiumEvents.length > 0 && (
        <section className="py-8 bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
              Premium Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumEvents.slice(0, 3).map((event, index) => (
                <EventCard key={`premium-${index}`} {...event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "All" ? "All Events" : `${selectedCategory} Events`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No events found matching your criteria</div>
              <Button onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* This Week's Schedule */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            This Week's Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="font-medium text-center mb-2">{day}</div>
                <div className="text-sm text-gray-600 text-center">
                  {Math.floor(Math.random() * 5) + 1} events
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-600" />
            Popular Venues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Cape Town Stadium",
              "V&A Waterfront",
              "Zeitz Museum",
              "Newlands Rugby Ground",
              "Baxter Theatre",
              "Century City Conference Centre",
              "Table Mountain National Park",
              "Cape Town International Convention Centre"
            ].map(venue => (
              <Button key={venue} variant="outline" className="p-4 h-auto hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="font-medium">{venue}</div>
                  <div className="text-sm text-gray-600">{Math.floor(Math.random() * 20) + 5} events</div>
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

export default Events;
