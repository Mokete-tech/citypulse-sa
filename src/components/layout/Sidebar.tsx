import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Tag, Calendar, LogIn, ChevronLeft, CreditCard,
  Home, Info, HelpCircle, Settings, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Deals', icon: Tag, path: '/deals' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Merchant Login', icon: LogIn, path: '/merchant/login' },
  { name: 'Merchant Packages', icon: CreditCard, path: '/merchant/packages' },
  { name: 'Saved Items', icon: Heart, path: '/saved' },
  { name: 'About', icon: Info, path: '/about' },
  { name: 'Contact', icon: HelpCircle, path: '/contact' },
  { name: 'Terms', icon: Settings, path: '/terms' },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  // Get current location for active menu highlighting
  const location = useLocation();

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sa-blue text-white transform transition-all duration-300 ease-in-out",
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

          <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
            {/* Main Navigation */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                Main Navigation
              </h3>
              <ul className="space-y-1">
                {menuItems.slice(0, 3).map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                        location.pathname === item.path && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Merchant Section */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                Merchant
              </h3>
              <ul className="space-y-1">
                {menuItems.slice(3, 5).map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                        location.pathname === item.path && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Section */}
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                User
              </h3>
              <ul className="space-y-1">
                {menuItems.slice(5, 6).map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                        location.pathname === item.path && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Section */}
            <div className="px-3">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 mb-2">
                Information
              </h3>
              <ul className="space-y-1">
                {menuItems.slice(6).map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors",
                        location.pathname === item.path && "bg-sky-700/70 font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
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
        isOpen ? "left-72" : "left-0"
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
