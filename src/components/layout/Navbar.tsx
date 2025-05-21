
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, LogIn, User, LogOut, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { user, signOut, isMerchant } = useAuth();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Add a conditional check for user to prevent TS errors
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    if (user.emailAddresses && user.emailAddresses[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-2 sm:px-4 md:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
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
          className="w-full flex justify-start pl-3 bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200"
          onClick={() => setSearchDialogOpen(true)}
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          <span className="truncate">Search deals, events or locations...</span>
        </Button>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500"
          onClick={() => setSearchDialogOpen(true)}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5 md:hidden" />
        </Button>

        {/* Search Dialog */}
        <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />

        {/* User is not logged in */}
        {!user && (
          <>
            <UserLoginDialog triggerClassName="flex items-center gap-1 sm:gap-2" />
          </>
        )}

        {/* User is logged in */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="User menu">
                {/* Notification indicator */}
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserInitials()} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved" className="flex items-center w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Saved Items</span>
                </Link>
              </DropdownMenuItem>
              {isMerchant && (
                <DropdownMenuItem asChild>
                  <Link to="/merchant/dashboard" className="flex items-center w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Merchant Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Removed Merchant Login button here */}
      </div>
    </nav>
  );
};

export default Navbar;
