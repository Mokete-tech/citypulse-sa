import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, LogIn, User, LogOut, Home, Tag, Calendar, MapPin, Phone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserLoginDialog from '@/components/auth/UserLoginDialog';
import UserRegistrationDialog from '@/components/auth/UserRegistrationDialog';
import MerchantLoginDialog from '@/components/auth/MerchantLoginDialog';
import GlobalSearch from '@/components/search/GlobalSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, signOut, loading, isMerchant } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Deals', href: '/deals', icon: <Tag className="h-5 w-5" /> },
    { name: 'Events', href: '/events', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Map', href: '/map', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 md:px-6 sticky top-0 z-40 w-full">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:flex"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          data-sidebar-toggle="true"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <div className="bg-gradient-to-r from-sa-blue to-sa-green p-2 rounded-md">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
          </Link>
          <GlobalSearch />
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center space-x-3">
        <div className="md:hidden">
          <GlobalSearch />
        </div>

        {/* User is not logged in */}
        {!user && (
          <>
            <UserRegistrationDialog>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Register</span>
              </Button>
            </UserRegistrationDialog>

            <UserLoginDialog>
              <Button variant="default" size="sm" className="hidden sm:flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button variant="default" size="icon" className="sm:hidden">
                <LogIn className="h-4 w-4" />
              </Button>
            </UserLoginDialog>
          </>
        )}

        {/* User is logged in */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {isMerchant && (
                <DropdownMenuItem asChild>
                  <Link to="/merchant/dashboard">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Merchant Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Always show Merchant Login in sidebar for mobile */}
        {!isMerchant && (
          <div className="md:hidden">
            <MerchantLoginDialog>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Merchant</span>
              </Button>
            </MerchantLoginDialog>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
