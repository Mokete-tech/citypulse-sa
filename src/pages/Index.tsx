
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredDeals = [
    {
      title: "50% Off Gourmet Burgers",
      category: "Food & Drink",
      business: "The Burger Joint",
      description: "Enjoy our premium beef burgers with artisanal toppings at half price! Made with locally sourced ingredients.",
      discount: "50% OFF",
      rating: 6,
      expires: "2024-12-31",
      featured: true
    },
    {
      title: "Buy 2 Get 1 Free Coffee",
      category: "Food & Drink", 
      business: "Cape Town Coffee Co",
      description: "Perfect morning deal for coffee lovers. Premium roasted beans from local South African farms.",
      discount: "Buy 2 Get 1",
      rating: 7,
      expires: "2024-12-25"
    },
    {
      title: "30% Off Designer Clothing",
      category: "Retail",
      business: "Fashion Forward", 
      description: "Latest fashion trends at unbeatable prices. Limited time offer on all designer collections.",
      discount: "30% OFF",
      rating: 8,
      expires: "2024-12-20",
      featured: true
    }
  ];

  const upcomingEvents = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to CityPulse South Africa</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover the best local deals and events across South Africa. Connect with your community and never miss out on amazing opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/deals">
              <Button size="lg" variant="secondary" className="text-blue-700">
                <Search className="w-5 h-5 mr-2" />
                Explore Deals
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                <Calendar className="w-5 h-5 mr-2" />
                Find Events
              </Button>
            </Link>
            <Link to="/ai-assistant">
              <Button size="lg" variant="secondary" className="text-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                PulsePal AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Deals</h2>
            <Link to="/deals">
              <Button variant="outline">View All Deals</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal, index) => (
              <DealCard key={index} {...deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore South Africa?</h2>
          <p className="text-xl mb-8">Join thousands of South Africans discovering amazing local experiences every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/deals">
              <Button size="lg" variant="secondary">Get Started</Button>
            </Link>
            <Link to="/ai-assistant">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                Try PulsePal AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
