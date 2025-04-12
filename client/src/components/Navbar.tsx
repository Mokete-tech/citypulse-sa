import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { currentUser, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Determine which page to search based on current location
      if (location.startsWith('/events')) {
        navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl text-primary">
              CityPulse
            </Link>
            <div className="bg-accent text-neutral-dark px-2 py-1 rounded text-xs font-semibold">SOUTH AFRICA</div>
          </div>
          
          {/* Search Box - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex relative max-w-xs">
            <Input
              type="text"
              placeholder="Search deals & events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 pr-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${location === "/" ? "text-primary" : "text-neutral-dark"} hover:text-primary transition font-medium`}>
                Home
            </Link>
            <Link href="/deals" className={`${location === "/deals" ? "text-primary" : "text-neutral-dark"} hover:text-primary transition font-medium`}>
                Deals
            </Link>
            <Link href="/events" className={`${location === "/events" ? "text-primary" : "text-neutral-dark"} hover:text-primary transition font-medium`}>
                Events
            </Link>
            
            {currentUser ? (
              <Link href="/merchant-dashboard">
                <Button variant="default" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition font-medium">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/merchant-login">
                <Button variant="default" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition font-medium">
                  Merchant Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-neutral-dark">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? "" : "hidden"} pb-4`}>
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="py-3 mb-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search deals & events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pl-10 pr-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        
          <Link href="/" className="block py-2 text-neutral-dark hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/deals" className="block py-2 text-neutral-dark hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Deals
          </Link>
          <Link href="/events" className="block py-2 text-neutral-dark hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Events
          </Link>
          
          {currentUser ? (
            <>
              <Link href="/merchant-dashboard" className="block py-2 text-neutral-dark hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="block py-2 text-red-600 font-medium">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/merchant-login" className="block py-2 text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
              Merchant Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
