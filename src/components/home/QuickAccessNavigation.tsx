
import { Link } from "react-router-dom";
import { Tag, Calendar, Bot, Building2 } from "lucide-react";

const QuickAccessNavigation = () => {
  return (
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
  );
};

export default QuickAccessNavigation;
