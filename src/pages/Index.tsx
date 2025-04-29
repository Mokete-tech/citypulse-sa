
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Tag, Calendar, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample data - in a real app this would come from a database
  const featuredDeals = [
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
    }
  ];
  
  const featuredEvents = [
    { 
      id: 1, 
      title: "Jazz Night at Westlake", 
      date: "2025-05-10", 
      time: "7:00 PM", 
      location: "Westlake Center",
      description: "Join us for a night of live jazz music with local artists" 
    },
    { 
      id: 2, 
      title: "Farmers Market", 
      date: "2025-05-17", 
      time: "9:00 AM", 
      location: "Pike Place",
      description: "Fresh local produce, handcrafted goods, and live music" 
    },
    { 
      id: 3, 
      title: "Tech Meetup", 
      date: "2025-05-22", 
      time: "6:30 PM", 
      location: "Central Library",
      description: "Networking event for tech professionals and enthusiasts" 
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to CityPulse Seattle</h1>
            <p className="text-muted-foreground">
              Discover the best local deals and events throughout Seattle.
            </p>
          </div>
          
          {/* Featured Deals Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Deals</h2>
              </div>
              <Link to="/deals">
                <Button variant="ghost" className="gap-1 text-primary">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map(deal => (
                <Card key={deal.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-1">{deal.category}</div>
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
                    <Button size="sm" variant="outline">View Deal</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Featured Events Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              </div>
              <Link to="/events">
                <Button variant="ghost" className="gap-1 text-primary">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <Card key={event.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{event.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button size="sm" variant="outline">View Event</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
