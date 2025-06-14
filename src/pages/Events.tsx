
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import LocationSelector from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLocation } from "@/hooks/useLocation";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { location } = useLocation();

  const categories = ["All", "Music", "Food & Drink", "Arts & Culture", "Sports", "Business", "Entertainment", "Education"];

  const { data: events = [], isLoading, error } = useEvents(selectedCategory, searchTerm);

  const premiumEvents = events.filter(event => event.premium);
  const filteredEvents = events;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Events</h2>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Events</h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover all upcoming events across South Africa.
              {location && (
                <span className="block mt-2 text-blue-600">
                  Showing events near {location.city}, {location.province}
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
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
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
              {location && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  in {location.city}
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} {...event} />
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
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
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
