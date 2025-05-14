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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if the device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? 'md:ml-64' : '',
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
