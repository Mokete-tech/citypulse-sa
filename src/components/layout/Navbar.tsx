
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-sa-blue to-sa-green p-1.5 rounded-md">
            <span className="text-white font-bold">CP</span>
          </div>
          <span className="hidden sm:inline-block font-bold text-lg text-gray-800">CityPulse</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search deals, events or locations..." 
            className="pl-10 w-full bg-gray-50"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Search className="h-5 w-5 md:hidden" />
        </Button>
        <Link to="/merchant/login">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Merchant Login
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
