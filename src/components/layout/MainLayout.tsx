import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Tag, Calendar, Building2, Search, User, LogOut, UserPlus, MapPin, Share2 } from 'lucide-react';
import OfflineIndicator from '../ui/OfflineIndicator';
import UserLoginDialog from '../auth/UserLoginDialog';
import UserRegistrationDialog from '../auth/UserRegistrationDialog';
import MerchantLoginDialog from '../auth/MerchantLoginDialog';
import VideoAd from '../ads/VideoAd';
import AppDownloadQR from '../app/AppDownloadQR';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSidebarAd, setShowSidebarAd] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Check for user location
  useEffect(() => {
    // Check if we already have location permission in localStorage
    const locationPermission = localStorage.getItem('locationPermission');

    if (locationPermission === 'granted') {
      getUserLocation();
    } else if (!locationPermission) {
      // Only show prompt if we haven't asked before
      setShowLocationPrompt(true);
    }

    // Show sidebar ad with 30% probability
    if (Math.random() < 0.3) {
      setShowSidebarAd(true);
    }
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        localStorage.setItem('locationPermission', 'granted');
        setShowLocationPrompt(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          localStorage.setItem('locationPermission', 'denied');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.user_metadata?.full_name) return 'CP';

    const fullName = user.user_metadata.full_name;
    const names = fullName.split(' ');

    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Share current page
  const handleShare = async () => {
    const shareData = {
      title: 'CityPulse South Africa',
      text: 'Check out this awesome deal/event on CityPulse!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Modern Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-md">
                  <span className="text-white font-bold">CP</span>
                </div>
                <span className="font-bold text-xl hidden sm:block">CityPulse</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/deals"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/deals'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Deals
              </Link>
              <Link
                to="/events"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/events'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Events
              </Link>
              <Link
                to="/nearby"
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  location.pathname === '/nearby'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  if (!userLocation) {
                    e.preventDefault();
                    getUserLocation();
                    toast.info('Getting your location...', {
                      description: 'Please allow location access to see nearby deals and events'
                    });
                  }
                }}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Nearby
              </Link>
              <Link
                to="/merchant/packages"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/merchant/packages'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Merchant Packages
              </Link>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Show merchant login only when not logged in */}
              {!user && (
                <div className="hidden md:block">
                  <MerchantLoginDialog />
                </div>
              )}

              {/* User is not logged in - show login/register buttons */}
              {!user && (
                <>
                  <div className="hidden md:block">
                    <UserRegistrationDialog>
                      <button className="text-sm font-medium text-gray-700 hover:text-blue-600">
                        <UserPlus className="h-4 w-4 inline mr-1" />
                        <span>Register</span>
                      </button>
                    </UserRegistrationDialog>
                  </div>

                  <UserLoginDialog>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm">
                      <User className="h-4 w-4 inline mr-2" />
                      <span className="hidden sm:inline">Member Login</span>
                    </button>
                  </UserLoginDialog>
                </>
              )}

              {/* User is logged in - show profile dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                        {user.user_metadata?.full_name || 'My Account'}
                      </span>
                    </button>
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
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Search bar - conditionally shown */}
          {searchOpen && (
            <div className="py-3 border-t border-gray-100 transition-all duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for deals and events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu - conditionally shown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 inline mr-2" />
                Home
              </Link>
              <Link
                to="/deals"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/deals'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Tag className="h-5 w-5 inline mr-2" />
                Deals
              </Link>
              <Link
                to="/events"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/events'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 inline mr-2" />
                Events
              </Link>
              <Link
                to="/nearby"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/nearby'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (!userLocation) {
                    e.preventDefault();
                    getUserLocation();
                    toast.info('Getting your location...', {
                      description: 'Please allow location access to see nearby deals and events'
                    });
                  }
                }}
              >
                <MapPin className="h-5 w-5 inline mr-2" />
                Nearby
              </Link>
              <Link
                to="/merchant/packages"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/merchant/packages'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="h-5 w-5 inline mr-2" />
                Merchant Packages
              </Link>
              {/* Mobile merchant login */}
              {!user && (
                <div className="block">
                  <MerchantLoginDialog>
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Building2 className="h-5 w-5 inline mr-2" />
                      Merchant Login
                    </button>
                  </MerchantLoginDialog>
                </div>
              )}

              {/* Mobile user registration */}
              {!user && (
                <div className="block">
                  <UserRegistrationDialog>
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="h-5 w-5 inline mr-2" />
                      Register
                    </button>
                  </UserRegistrationDialog>
                </div>
              )}

              {/* Mobile user login */}
              {!user && (
                <div className="block">
                  <UserLoginDialog>
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 inline mr-2" />
                      Member Login
                    </button>
                  </UserLoginDialog>
                </div>
              )}

              {/* Mobile logout for logged in users */}
              {user && (
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 inline mr-2" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Location permission prompt */}
      {showLocationPrompt && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">
                  Enable location services to discover nearby deals and events
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationPrompt(false)}
                >
                  Not Now
                </Button>
                <Button
                  size="sm"
                  onClick={getUserLocation}
                >
                  Enable Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content with sidebar */}
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Sidebar with ads and app download */}
        <aside className="hidden lg:block w-80 p-4 border-l border-gray-200">
          <div className="sticky top-20 space-y-8">
            {/* Video Ad */}
            {showSidebarAd && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sponsored</h3>
                <VideoAd placement="sidebar" autoplay={false} />
              </div>
            )}

            {/* App Download QR Code */}
            <AppDownloadQR />
          </div>
        </aside>
      </div>

      {/* Share button (fixed) */}
      <button
        onClick={handleShare}
        className="fixed bottom-20 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 z-30"
        aria-label="Share"
      >
        <Share2 className="h-5 w-5 text-blue-600" />
      </button>

      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-white p-1.5 rounded-md">
                  <span className="text-blue-600 font-bold">CP</span>
                </div>
                <span className="font-bold text-xl">CityPulse</span>
              </Link>
              <p className="text-gray-400 mb-4">Discover the best local deals and events across South Africa.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/deals" className="text-gray-400 hover:text-white">Deals</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white">Events</Link></li>
                <li><Link to="/merchant/packages" className="text-gray-400 hover:text-white">Merchant Packages</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 CityPulse South Africa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
