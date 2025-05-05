import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
      
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
