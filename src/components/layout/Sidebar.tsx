
import { Link } from 'react-router-dom';
import {
  Tag, Calendar, LogIn, ChevronLeft, CreditCard
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
            <div className="mt-6 px-4">
              <h3 className="text-sm font-semibold mb-3 text-white/80">Filter Categories</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/deals?category=food-drink" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                    <span>Food & Drink</span>
                  </Link>
                </li>
                <li>
                  <Link to="/deals?category=retail" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                    <span>Retail</span>
                  </Link>
                </li>
                <li>
                  <Link to="/deals?category=beauty" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                    <span>Beauty</span>
                  </Link>
                </li>
                <li>
                  <Link to="/deals?category=entertainment" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                    <span>Entertainment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/deals?category=travel" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    <span>Travel</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Event Categories */}
            <div className="mt-6 px-4">
              <h3 className="text-sm font-semibold mb-3 text-white/80">Event Types</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/events?category=music" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    <span>Music</span>
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=food-shopping" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    <span>Food & Shopping</span>
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=networking" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                    <span>Networking</span>
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=sports" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    <span>Sports</span>
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=arts" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sky-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                    <span>Arts & Culture</span>
                  </Link>
                </li>
              </ul>
            </div>
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
