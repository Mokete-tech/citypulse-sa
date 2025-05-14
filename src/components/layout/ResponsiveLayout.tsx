import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showFooter?: boolean;
  className?: string;
  fullWidth?: boolean;
}

/**
 * A responsive layout component that includes a sidebar, navbar, and optional footer
 */
export function ResponsiveLayout({
  children,
  title,
  description,
  showFooter = true,
  className,
  fullWidth = false,
}: ResponsiveLayoutProps) {
  // Initialize sidebar state from localStorage or default to true
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we have a stored preference
    const storedState = localStorage.getItem('sidebarOpen');
    // If on mobile, default to closed
    if (window.innerWidth < 768) return false;
    // Otherwise use stored preference or default to open
    return storedState !== null ? storedState === 'true' : true;
  });
  // Track if we're on mobile for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Use isMobile in a useEffect to avoid the unused variable warning
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      // Auto-close sidebar on mobile when component mounts
      setSidebarOpen(false);
    }
  }, [isMobile, sidebarOpen]);

  // Toggle sidebar with enhanced functionality
  const toggleSidebar = () => {
    // Toggle the sidebar state
    setSidebarOpen(prevState => !prevState);

    // Store the sidebar state in localStorage for persistence
    localStorage.setItem('sidebarOpen', (!sidebarOpen).toString());

    // Force a layout recalculation to ensure the transition works
    document.body.offsetHeight;
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Only auto-adjust sidebar if user hasn't manually set it
      // (we check this by looking for the localStorage item)
      const userHasSetPreference = localStorage.getItem('sidebarOpen') !== null;

      if (!userHasSetPreference) {
        // Auto-close sidebar on mobile, open on desktop
        setSidebarOpen(!isMobileView);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? 'md:ml-72' : 'ml-0',
          className
        )}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <main className={cn(
          "flex-1 p-4 md:p-6",
          fullWidth ? 'w-full' : 'max-w-7xl mx-auto'
        )}>
          {(title || description) && (
            <div className="mb-8">
              {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}

          {children}
        </main>

        {showFooter && <Footer />}
      </div>
    </div>
  );
}

export default ResponsiveLayout;
