
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, LogIn, User, LogOut, Home, Tag, Calendar, MapPin, Phone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserLoginDialog from '@/components/auth/UserLoginDialog';
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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="bg-gradient-to-r from-sa-blue to-sa-green p-2 rounded-md">
                    <span className="text-white font-bold text-lg">CP</span>
                  </div>
                  <span className="font-bold text-xl text-gray-800">CityPulse</span>
                </Link>
              </div>

              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === link.href
                            ? 'bg-gray-100 text-primary font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t mt-auto">
                {!user ? (
                  <UserLoginDialog>
                    <Button className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </UserLoginDialog>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>

                    {isMerchant && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/merchant/dashboard">
                          <LogIn className="mr-2 h-4 w-4" />
                          Merchant Dashboard
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={toggleSidebar}
          data-sidebar-toggle="true"
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
        <GlobalSearch />
      </div>

      <div className="flex items-center space-x-3">
        <div className="md:hidden">
          <GlobalSearch />
        </div>

        {/* User is not logged in */}
        {!user && (
          <>
            <UserLoginDialog className="flex items-center gap-2">
              <Button variant="primary" size="sm" className="hidden sm:flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button variant="primary" size="icon" className="sm:hidden">
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
