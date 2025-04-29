
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
      location: "Cape Town Café", 
      description: "Get 20% off any coffee drink, every Tuesday", 
      expiresAt: "2025-05-15",
      category: "Food & Drink",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 2, 
      title: "Buy One Get One Free", 
      location: "Johannesburg Books", 
      description: "Buy one book, get one free of equal or lesser value", 
      expiresAt: "2025-05-20",
      category: "Retail",
      imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 3, 
      title: "30% Off First Visit", 
      location: "Durban Spa & Salon", 
      description: "New customers get 30% off their first service", 
      expiresAt: "2025-06-01",
      category: "Beauty",
      imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];
  
  const featuredEvents = [
    { 
      id: 1, 
      title: "Jazz Night at V&A Waterfront", 
      date: "2025-05-10", 
      time: "7:00 PM", 
      location: "Cape Town Waterfront",
      description: "Join us for a night of live jazz music with local artists",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 2, 
      title: "Farmers Market", 
      date: "2025-05-17", 
      time: "9:00 AM", 
      location: "Neighbourgoods Market, Johannesburg",
      description: "Fresh local produce, handcrafted goods, and live music",
      imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 3, 
      title: "Tech Meetup", 
      date: "2025-05-22", 
      time: "6:30 PM", 
      location: "Durban Digital Hub",
      description: "Networking event for tech professionals and enthusiasts",
      imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to CityPulse South Africa</h1>
            <p className="text-muted-foreground">
              Discover the best local deals and events throughout South Africa.
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
                  {deal.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-1">{deal.category}</div>
                    <CardTitle>{deal.title}</CardTitle>
                    <CardDescription>{deal.location}</CardDescription>
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
                  {event.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
