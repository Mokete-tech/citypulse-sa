
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tag, Calendar, Building2, UserPlus,
  LogIn, Settings, ChevronRight, ChevronLeft, Mail,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MerchantLoginDialog from '@/components/auth/MerchantLoginDialog';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sa-blue text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
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

              {/* Merchant Login/Dashboard */}
              <li>
                {isMerchant ? (
                  <Link
                    to="/merchant/dashboard"
                    className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sky-700 transition-colors"
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

      <div className="hidden md:block fixed bottom-4 left-0 ml-64 z-50">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-l-none"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
