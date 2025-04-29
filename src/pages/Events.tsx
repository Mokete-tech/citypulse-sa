
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Sample events data - this would come from Firebase in the real app
  const events = [
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
    },
    { 
      id: 4, 
      title: "Art Gallery Opening", 
      date: "2025-05-28", 
      time: "5:00 PM", 
      location: "Pretoria Art Gallery",
      description: "Opening reception for new exhibit featuring local artists",
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 5, 
      title: "Comedy Night", 
      date: "2025-06-05", 
      time: "8:00 PM", 
      location: "Soweto Theatre",
      description: "Stand-up comedy show featuring regional comedians",
      imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    { 
      id: 6, 
      title: "Weekend Wine Tasting", 
      date: "2025-06-12", 
      time: "2:00 PM", 
      location: "Stellenbosch Winery",
      description: "Sample wines from South African vineyards with light appetizers",
      imageUrl: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Local Events</h1>
            <p className="text-muted-foreground">
              Discover all upcoming events across South Africa.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search events by name or location..." 
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
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
                  <Button size="sm">View Event</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Events;
