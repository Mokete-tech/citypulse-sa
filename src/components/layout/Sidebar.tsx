import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Tag, Calendar, Building2, UserPlus,
  LogIn, Settings, ChevronRight, ChevronLeft, Mail,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MerchantLoginDialog from '@/components/auth/MerchantLoginDialog';
import { useAuth } from '@/contexts/AuthContext';
import FilterCategories from '@/components/filters/FilterCategories';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Deals', icon: Tag, path: '/deals' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Merchant Packages', icon: CreditCard, path: '/merchant/packages' },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { isMerchant } = useAuth();
  const location = useLocation();

  // Check if we're on a page that should show categories
  const showCategories = location.pathname === '/deals' || location.pathname === '/events';

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sa-blue text-white transform transition-all duration-300 ease-in-out shadow-xl sidebar",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      data-sidebar="true"
    >
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
            data-sidebar-toggle="true"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="pt-4 pb-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}

              {/* Merchant Login/Dashboard */}
              <li>
                {isMerchant ? (
                  <Link
                    to="/merchant/dashboard"
                    className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  >
                    <Building2 className="h-5 w-5 mr-3" />
                    <span>Merchant Dashboard</span>
                  </Link>
                ) : (
                  <MerchantLoginDialog>
                    <button className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors w-full text-left">
                      <LogIn className="h-5 w-5 mr-3" />
                      <span>Merchant Login</span>
                    </button>
                  </MerchantLoginDialog>
                )}
              </li>
            </ul>
          </nav>

          {/* Categories section */}
          {showCategories && (
            <div className="border-t border-sky-700">
              <FilterCategories />
            </div>
          )}
        </div>

        {/* Footer section */}
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
    </aside>
  );
};

export default Sidebar;
