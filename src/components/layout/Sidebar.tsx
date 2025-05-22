
import { Link } from 'react-router-dom';
import {
  Tag, Calendar, LogIn, ChevronLeft, CreditCard, Heart, Sparkles, User, Settings, Building, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define userItems array that was missing
const userItems = [
  {
    name: 'Profile',
    path: '/profile',
    icon: User
  },
  {
    name: 'Favorites',
    path: '/favorites',
    icon: Heart
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings
  }
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  // Get authentication context to check if user is logged in
  const { user } = useAuth();
  
  // Create a safe wrapper for checking the current path
  const isActivePath = (path: string) => {
    // Check if window is available (we're in the browser)
    if (typeof window !== 'undefined') {
      return window.location.pathname === path;
    }
    return false;
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-72 bg-sa-blue text-white transform transition-all duration-300 ease-in-out shadow-xl",
        // Mobile: translate based on isOpen state
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: translate based on isOpen state (fixed)
        isOpen ? "md:translate-x-0" : "md:-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sky-700">
            <Link to="/" className="text-xl font-bold flex items-center gap-2" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
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
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
            {/* Main Navigation */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                Main Navigation
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/deals"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/deals') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <Tag className="h-5 w-5 mr-3" />
                    <span>Deals</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/events') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>Events</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/merchant/login"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/merchant/login') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <Building className="h-5 w-5 mr-3" />
                    <span>Business Sign in</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* AI Assistant Section */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                AI Assistant
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/ai-assistant"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/ai-assistant') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    <span>PulsePal AI</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Business Section with Business Packages added */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                Business
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/merchant/login"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/merchant/login') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <LogIn className="h-5 w-5 mr-3" />
                    <span>Business Portal</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/merchant/packages"
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                      isActivePath('/merchant/packages') && "bg-sky-700/70 font-medium"
                    )}
                  >
                    <Package className="h-5 w-5 mr-3" />
                    <span>Business Packages</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* User Section - Only shown when logged in */}
            {user && (
              <div className="px-3 mb-6">
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                  User
                </h3>
                <ul className="space-y-1">
                  {userItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                          isActivePath(item.path) && "bg-sky-700/70 font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          aria-label="Close sidebar overlay"
        ></div>
      )}

      <div className={cn(
        "hidden md:block fixed bottom-4 z-50 transition-all duration-300",
        isOpen ? "left-72" : "left-0"
      )}>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-l-none shadow-md"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
          <span className="sr-only">{isOpen ? "Close sidebar" : "Open sidebar"}</span>
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
