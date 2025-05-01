
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  // Add a toggleSidebar function to fix the TypeScript error
  const toggleSidebar = () => {
    // This is a dummy function since the sidebar isn't actually used on this page
    console.log('Sidebar toggle called on Unauthorized page');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-100 p-4 rounded-full mb-6">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default">
              <Link to="/">Return to Home</Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/merchant/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Unauthorized;
