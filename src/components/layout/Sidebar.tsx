
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag, Calendar, LogIn, ChevronLeft, CreditCard, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Deals', icon: Tag, path: '/deals' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Merchant Login', icon: LogIn, path: '/merchant/login' },
  { name: 'Merchant Packages', icon: CreditCard, path: '/merchant/packages' },
];

// Filter categories data
const filterCategories = [
  { name: 'Food & Drink', color: 'bg-amber-400', path: '/deals?category=food-drink' },
  { name: 'Retail', color: 'bg-emerald-400', path: '/deals?category=retail' },
  { name: 'Beauty', color: 'bg-pink-400', path: '/deals?category=beauty' },
  { name: 'Entertainment', color: 'bg-purple-400', path: '/deals?category=entertainment' },
  { name: 'Travel', color: 'bg-blue-400', path: '/deals?category=travel' },
];

// Event types data
const eventTypes = [
  { name: 'Music', color: 'bg-red-400', path: '/events?category=music' },
  { name: 'Food & Shopping', color: 'bg-yellow-400', path: '/events?category=food-shopping' },
  { name: 'Networking', color: 'bg-indigo-400', path: '/events?category=networking' },
  { name: 'Sports', color: 'bg-green-400', path: '/events?category=sports' },
  { name: 'Arts & Culture', color: 'bg-orange-400', path: '/events?category=arts' },
];

// Simplified collapsible section component
interface CollapsibleSectionProps {
  title: string;
  id: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, id, children }: CollapsibleSectionProps) => {
  // Simple state for expanded/collapsed
  const [isExpanded, setIsExpanded] = useState(true);

  // Toggle section expanded state
  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6 px-4">
      <button
        onClick={toggleSection}
        className="flex items-center justify-between w-full text-sm font-semibold mb-2 text-white/80 hover:text-white transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`section-${id}`}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded ? "" : "-rotate-90"
          )}
        />
      </button>

      <div
        id={`section-${id}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sa-blue text-white transform transition-all duration-300 ease-in-out",
        // Mobile: translate based on isOpen state
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: translate based on isOpen state (fixed)
        isOpen ? "md:translate-x-0" : "md:-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sky-700">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <div className="bg-gradient-to-r from-white to-gray-200 p-1.5 rounded-md">
                <span className="text-sa-blue font-bold">CP</span>
              </div>
              <span>CityPulse</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Filter Categories */}
            <CollapsibleSection title="Filter Categories" id="filter-categories">
              <ul className="space-y-1">
                {filterCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={category.path}
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${category.color} mr-2`}></span>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Event Categories */}
            <CollapsibleSection title="Event Types" id="event-types">
              <ul className="space-y-1">
                {eventTypes.map((eventType) => (
                  <li key={eventType.name}>
                    <Link
                      to={eventType.path}
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${eventType.color} mr-2`}></span>
                      <span>{eventType.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </nav>

          <div className="p-4 border-t border-sky-700">
            <div className="px-4 py-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-sky-700 flex items-center justify-center">
                  <span className="font-medium text-white">CP</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">CityPulse</p>
                  <p className="text-xs opacity-70">South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={cn(
        "hidden md:block fixed bottom-4 z-50 transition-all duration-300",
        isOpen ? "left-64" : "left-0"
      )}>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-l-none shadow-md"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
          <span className="sr-only">{isOpen ? "Close sidebar" : "Open sidebar"}</span>
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
