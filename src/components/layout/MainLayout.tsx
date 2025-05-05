import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Initialize from localStorage on client-side only
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sidebarClosed');
      if (stored === 'true') {
        setIsOpen(false);
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col main-content">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
