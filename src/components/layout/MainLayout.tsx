import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Tag, Calendar, Building2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-md">
                <span className="text-blue-600 font-bold">CP</span>
              </div>
              <span>CityPulse</span>
            </Link>
            <button
              className="text-white md:hidden"
              onClick={toggleSidebar}
              data-sidebar-toggle="true"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-blue-700">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/deals" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-blue-700">
                  <Tag className="h-5 w-5" />
                  <span>Deals</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-blue-700">
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link to="/merchant/packages" className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-blue-700">
                  <Building2 className="h-5 w-5" />
                  <span>Merchant Packages</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-blue-700">
            <p className="text-sm text-blue-200">© 2025 CityPulse South Africa</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Simple Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              onClick={toggleSidebar}
              data-sidebar-toggle="true"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-2 md:hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-1.5 rounded-md">
                <span className="text-white font-bold">CP</span>
              </div>
              <span className="font-bold">CityPulse</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/merchant/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Merchant Login
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Member Login
            </button>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-800 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-md">
                    <span className="text-blue-600 font-bold">CP</span>
                  </div>
                  <span className="font-bold text-xl">CityPulse</span>
                </Link>
                <p className="mt-2 text-gray-400">South Africa</p>
              </div>

              <div className="flex gap-6">
                <Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
                <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-400 text-sm">
              © 2025 CityPulse South Africa. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
