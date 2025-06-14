
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, Calendar, Sparkles, TrendingUp, Users, MapPin } from "lucide-react";

const HeroSection = () => {
  const featuredHighlights = [
    {
      icon: Tag,
      title: "500+ Active Deals",
      description: "From restaurants to retail",
      color: "text-blue-500"
    },
    {
      icon: Calendar,
      title: "200+ Events Monthly",
      description: "Concerts, workshops & more",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "50,000+ Users",
      description: "Growing community",
      color: "text-purple-500"
    },
    {
      icon: MapPin,
      title: "9 Major Cities",
      description: "Across South Africa",
      color: "text-orange-500"
    }
  ];

  return (
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
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/deals">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all">
                <Tag className="w-5 h-5 mr-2" />
                Find Deals
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all">
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

          {/* Platform Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {featuredHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:scale-105 transition-transform">
                  <Icon className={`w-8 h-8 ${highlight.color} mb-3 mx-auto`} />
                  <h3 className="text-lg font-bold mb-2">{highlight.title}</h3>
                  <p className="text-blue-100 text-sm">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
