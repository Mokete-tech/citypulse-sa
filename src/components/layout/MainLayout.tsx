import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Initialize from localStorage, default to true (open) if not set
    const stored = localStorage.getItem('sidebarClosed');
    return stored ? stored !== 'true' : true;
  });

  // Effect to add sidebar-closed class to body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.remove('sidebar-closed');
    } else {
      document.body.classList.add('sidebar-closed');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('sidebar-closed');
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    localStorage.setItem('sidebarClosed', String(!isOpen));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - with sidebar-container class for CSS targeting */}
      <div className="sidebar-container">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content - with main-content class for CSS targeting */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 main-content ${
          isOpen ? 'md:ml-64' : ''
        }`}
      >
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
