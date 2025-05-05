import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-4 text-sa-blue">404</h1>
          <p className="text-2xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="bg-sa-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
