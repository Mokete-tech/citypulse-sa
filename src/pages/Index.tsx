
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, Calendar, Bot, Building2, Sparkles, Play, Users, Star, TrendingUp } from "lucide-react";

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
      featured: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop"
    },
    {
      title: "30% Off Designer Clothing",
      category: "Retail",
      business: "Fashion Forward",
      description: "Latest fashion trends at unbeatable prices. Limited time offer.",
      discount: "30% OFF",
      rating: 4.6,
      expires: "2024-12-20",
      featured: true,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop"
    },
    {
      title: "Wine Tasting Experience",
      category: "Food & Drink",
      business: "Stellenbosch Winery",
      description: "Sample premium South African wines with expert sommelier guidance.",
      discount: "40% OFF",
      rating: 4.9,
      expires: "2024-12-30",
      featured: true,
      image: "https://images.unsplash.com/photo-1506377872008-6645d6ba8e83?w=500&h=300&fit=crop"
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
      premium: true,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop"
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
      premium: true,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Cape Town",
      rating: 5,
      comment: "Found amazing deals every week! Saved over R2000 last month.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Mike Chen",
      location: "Johannesburg",
      rating: 5,
      comment: "The events section helped me discover so many cool local activities.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Lisa van der Merwe",
      location: "Durban",
      rating: 5,
      comment: "PulsePal AI gives the best recommendations for my interests!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Video Background */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-blue-200">CityPulse</span> South Africa
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover the best local deals and events across South Africa. Connect with 
              your community and never miss out on amazing opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link to="/deals">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all">
                  <Tag className="w-5 h-5 mr-2" />
                  Find Deals
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all">
                  <Calendar className="w-5 h-5 mr-2" />
                  Discover Events
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 hover:scale-105 transition-all">
                  <Sparkles className="w-5 h-5 mr-2" />
                  PulsePal AI
                </Button>
              </Link>
            </div>
            
            {/* Video Preview */}
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-blue-800 to-purple-800 flex items-center justify-center">
                  <Button size="lg" className="bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white">
                    <Play className="w-8 h-8 mr-2" />
                    Watch CityPulse in Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Deals</div>
            </div>
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-gray-600">Events Monthly</div>
            </div>
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <div className="text-3xl font-bold text-orange-600 mb-2">800+</div>
              <div className="text-gray-600">Local Businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/deals" className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all">
              <Tag className="w-6 h-6 mr-2 text-blue-600" />
              <span className="font-medium text-blue-600">Deals</span>
            </Link>
            <Link to="/events" className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 hover:scale-105 transition-all">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              <span className="font-medium text-green-600">Events</span>
            </Link>
            <Link to="/ai-assistant" className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 hover:scale-105 transition-all">
              <Bot className="w-6 h-6 mr-2 text-purple-600" />
              <span className="font-medium text-purple-600">PulsePal AI</span>
            </Link>
            <Link to="/business-portal" className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 hover:scale-105 transition-all">
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
              <Button variant="outline" className="hover:scale-105 transition-transform">
                View All Deals
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Button variant="outline" className="hover:scale-105 transition-transform">
                View All Events
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers across South Africa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </div>
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
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ai-assistant">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all">
                <Bot className="w-5 h-5 mr-2" />
                Try PulsePal AI
              </Button>
            </Link>
            <Link to="/business-portal">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 hover:scale-105 transition-all">
                <Building2 className="w-5 h-5 mr-2" />
                Business Portal
              </Button>
            </Link>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all">
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
