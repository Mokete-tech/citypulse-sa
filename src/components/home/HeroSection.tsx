
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, Calendar, Sparkles } from "lucide-react";
import CityShowcase from "@/components/CityShowcase";

const HeroSection = () => {
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
          <div className="flex flex-wrap justify-center gap-4 mb-8">
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
          
          <CityShowcase 
            title="CityPulse Across South Africa"
            description="Experience the vibrant culture and amazing deals across Cape Town, Johannesburg, Durban, and more South African cities."
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
