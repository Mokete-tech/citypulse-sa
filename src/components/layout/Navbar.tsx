import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, LogOut, User, Settings, Store, Shield } from 'lucide-react';
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useTheme } from "@/components/providers/ThemeProvider"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { isSignedIn, signOut } = useClerk();
  const { user } = useUser();
  const { isAdmin, isMerchant } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const renderRoleBasedLinks = () => {
    const links = [
      <Link key="home" to="/" className="text-foreground/60 hover:text-foreground transition-colors">
        Home
      </Link>,
      <Link key="deals" to="/deals" className="text-foreground/60 hover:text-foreground transition-colors">
        Deals
      </Link>,
      <Link key="events" to="/events" className="text-foreground/60 hover:text-foreground transition-colors">
        Events
      </Link>,
      <Link key="automation" to="/automation" className="text-foreground/60 hover:text-foreground transition-colors">
        Automation
      </Link>,
      <Link key="ai-assistant" to="/ai-assistant" className="text-foreground/60 hover:text-foreground transition-colors">
        AI Assistant
      </Link>,
      <Link key="contact" to="/contact" className="text-foreground/60 hover:text-foreground transition-colors">
        Contact
      </Link>,
    ];

    if (isMerchant) {
      links.push(
        <Link key="merchant-dashboard" to="/merchant/dashboard" className="text-foreground/60 hover:text-foreground transition-colors">
          Merchant Dashboard
        </Link>
      );
    }

    if (isAdmin) {
      links.push(
        <Link key="admin-dashboard" to="/admin/dashboard" className="text-foreground/60 hover:text-foreground transition-colors">
          Admin Dashboard
        </Link>
      );
    }

    return links;
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Logo />
            
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {renderRoleBasedLinks()}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.firstName || "Avatar"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isMerchant && (
                    <DropdownMenuItem asChild>
                      <Link to="/merchant/dashboard" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Merchant Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/sign-in">
                <Button className="bg-primary hover:bg-primary/90">
                  Client Login
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-200 ease-in-out",
        isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          {renderRoleBasedLinks().map((link, index) => (
            <div key={index} onClick={() => setIsMobileMenuOpen(false)}>
              {link}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
