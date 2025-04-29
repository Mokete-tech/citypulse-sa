
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Tag } from 'lucide-react';

const Deals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Sample deals data - this would come from Firebase in the real app
  const deals = [
    { 
      id: 1, 
      title: "20% Off All Coffee", 
      business: "Seattle Coffee House", 
      description: "Get 20% off any coffee drink, every Tuesday", 
      expiresAt: "2025-05-15",
      category: "Food & Drink" 
    },
    { 
      id: 2, 
      title: "Buy One Get One Free", 
      business: "Capitol Books", 
      description: "Buy one book, get one free of equal or lesser value", 
      expiresAt: "2025-05-20",
      category: "Retail" 
    },
    { 
      id: 3, 
      title: "30% Off First Visit", 
      business: "Green Spa & Salon", 
      description: "New customers get 30% off their first service", 
      expiresAt: "2025-06-01",
      category: "Beauty" 
    },
    { 
      id: 4, 
      title: "Kids Eat Free", 
      business: "Family Diner", 
      description: "Kids under 12 eat free with purchase of adult entrée", 
      expiresAt: "2025-05-30",
      category: "Food & Drink" 
    },
    { 
      id: 5, 
      title: "15% Off Total Bill", 
      business: "Lakeside Restaurant", 
      description: "Enjoy 15% off your total bill on weekdays", 
      expiresAt: "2025-06-15",
      category: "Food & Drink" 
    },
    { 
      id: 6, 
      title: "50% Off Second Item", 
      business: "Urban Clothing", 
      description: "Buy one item at full price, get 50% off second item", 
      expiresAt: "2025-05-25",
      category: "Retail" 
    }
  ];
  
  // Filter deals based on search query
  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deal.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Local Deals</h1>
            <p className="text-muted-foreground">
              Explore all the best deals from local businesses in Seattle.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search deals by name, business, or category..." 
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map(deal => (
              <Card key={deal.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="text-sm flex items-center gap-1 text-muted-foreground mb-1">
                    <Tag className="h-3 w-3" /> {deal.category}
                  </div>
                  <CardTitle>{deal.title}</CardTitle>
                  <CardDescription>{deal.business}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{deal.description}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Expires: {new Date(deal.expiresAt).toLocaleDateString()}
                  </div>
                  <Button size="sm">View Deal</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredDeals.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2">No deals found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Deals;
