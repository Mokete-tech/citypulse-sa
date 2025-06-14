
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, Calendar, Bot, Building2, Sparkles } from "lucide-react";

const Index = () => {
  const featuredDeals = [
    {
      title: "50% Off Gourmet Burgers",
      category: "Food & Drink",
      business: "The Burger Joint",
      description: "Enjoy our premium beef burgers with artisanal toppings at half price!",
      discount: "50% OFF",
      rating: 4.8,
      expires: "2024-12-31",
      featured: true
    },
    {
      title: "30% Off Designer Clothing",
      category: "Retail",
      business: "Fashion Forward",
      description: "Latest fashion trends at unbeatable prices. Limited time offer.",
      discount: "30% OFF",
      rating: 4.6,
      expires: "2024-12-20",
      featured: true
    }
  ];

  const upcomingEvents = [
    {
      title: "Summer Music Festival",
      category: "Music",
      organizer: "Event Organizers SA",
      description: "Three days of amazing live music featuring local and international artists.",
      date: "2024-12-15",
      time: "18:00",
      venue: "Cape Town Stadium",
      price: "R350",
      rating: 4.9,
      premium: true
    },
    {
      title: "Art Gallery Opening",
      category: "Arts & Culture",
      organizer: "Modern Art Gallery",
      description: "Discover contemporary South African art at this exclusive opening.",
      date: "2024-12-25",
      time: "18:30",
      venue: "Zeitz Museum",
      price: "Free",
      rating: 4.7,
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-blue-200">CityPulse</span> South Africa
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover the best local deals and events across South Africa. Connect with 
              your community and never miss out on amazing opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/deals">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Tag className="w-5 h-5 mr-2" />
                  Explore Deals
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  Find Events
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                  <Sparkles className="w-5 h-5 mr-2" />
                  PulsePal AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/deals" className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Tag className="w-6 h-6 mr-2 text-blue-600" />
              <span className="font-medium text-blue-600">Deals</span>
            </Link>
            <Link to="/events" className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              <span className="font-medium text-green-600">Events</span>
            </Link>
            <Link to="/ai-assistant" className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Bot className="w-6 h-6 mr-2 text-purple-600" />
              <span className="font-medium text-purple-600">PulsePal AI</span>
            </Link>
            <Link to="/business-portal" className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Building2 className="w-6 h-6 mr-2 text-orange-600" />
              <span className="font-medium text-orange-600">Business Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Tag className="w-8 h-8 mr-3 text-blue-600" />
              Featured Deals
            </h2>
            <Link to="/deals">
              <Button variant="outline">View All Deals</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredDeals.map((deal, index) => (
              <DealCard key={index} {...deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-green-600" />
              Upcoming Events
            </h2>
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover More?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of South Africans finding the best local deals and events.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/ai-assistant">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Bot className="w-5 h-5 mr-2" />
                Try PulsePal AI
              </Button>
            </Link>
            <Link to="/business-portal">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Building2 className="w-5 h-5 mr-2" />
                Business Portal
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
