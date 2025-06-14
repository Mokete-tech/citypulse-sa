
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, Building2, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CTASectionProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

const CTASection = ({ onOpenAuth, onOpenProfile }: CTASectionProps) => {
  const { user } = useAuth();

  return (
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
          {user ? (
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
              onClick={onOpenProfile}
            >
              <Users className="w-5 h-5 mr-2" />
              My Profile
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all"
              onClick={onOpenAuth}
            >
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
