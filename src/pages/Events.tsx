
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Events = () => {
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
      rating: 4,
      premium: true
    },
    {
      title: "Food & Wine Tasting", 
      category: "Food & Shopping",
      organizer: "Gourmet Events",
      description: "Experience the best of South African cuisine paired with premium wines from local vineyards. Meet renowned chefs and winemakers.",
      date: "2024-12-18",
      time: "19:00", 
      venue: "V&A Waterfront",
      price: "R450",
      rating: 5
    },
    {
      title: "Business Networking Evening",
      category: "Networking",
      organizer: "Business Network SA",
      description: "Connect with entrepreneurs and business leaders in Cape Town. Includes keynote speakers and networking dinner.",
      date: "2024-12-20",
      time: "17:30",
      venue: "Century City Conference Centre", 
      price: "R150",
      rating: 6,
      premium: true
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
      rating: 7
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
      rating: 8,
      premium: true
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
      rating: 9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Events</h1>
          <p className="text-xl text-gray-600 mb-8">Discover all upcoming events across South Africa.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search events by name or location..."
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
