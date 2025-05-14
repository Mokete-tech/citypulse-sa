
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, LogIn, User, LogOut, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import UserLoginDialog from '@/components/auth/UserLoginDialog';
import { SearchDialog } from '@/components/search/SearchDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, signOut, loading, isMerchant } = useAuth();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

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
        <Button
          variant="outline"
          className="w-full flex justify-start pl-3 bg-gray-50 text-gray-500 hover:bg-gray-100"
          onClick={() => setSearchDialogOpen(true)}
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          Search deals, events or locations...
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500"
          onClick={() => setSearchDialogOpen(true)}
        >
          <SearchIcon className="h-5 w-5 md:hidden" />
        </Button>

        {/* Search Dialog */}
        <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />

        {/* User is not logged in */}
        {!user && (
          <>
            <UserLoginDialog className="flex items-center gap-2" />
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
          <Link to="/merchant/login" className="md:hidden">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Merchant</span>
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
