
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Tag } from "lucide-react";

const UpcomingEvents = () => {
  const mockEvents = [
    {
      id: 1,
      title: "Cape Town Food & Wine Festival",
      venue: "V&A Waterfront",
      location: "Cape Town",
      date: "2024-07-15",
      time: "10:00",
      price: 250,
      category: "Food & Drink",
      attendees: 1200,
      maxAttendees: 1500,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      premium: true
    },
    {
      id: 2,
      title: "Jazz Under the Stars",
      venue: "Constitutional Hill",
      location: "Johannesburg",
      date: "2024-07-20",
      time: "19:00",
      price: 180,
      category: "Music",
      attendees: 450,
      maxAttendees: 500,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      premium: true
    },
    {
      id: 3,
      title: "Durban Beach Marathon",
      venue: "Golden Mile",
      location: "Durban",
      date: "2024-07-25",
      time: "06:00",
      price: 120,
      category: "Sports",
      attendees: 2800,
      maxAttendees: 3000,
      image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop",
      premium: false
    },
    {
      id: 4,
      title: "Tech Innovation Summit",
      venue: "Sandton Convention Centre",
      location: "Johannesburg",
      date: "2024-08-02",
      time: "09:00",
      price: 450,
      category: "Business",
      attendees: 800,
      maxAttendees: 1000,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      premium: true
    },
    {
      id: 5,
      title: "Art & Culture Exhibition",
      venue: "Zeitz Museum",
      location: "Cape Town",
      date: "2024-08-05",
      time: "11:00",
      price: 0,
      category: "Arts & Culture",
      attendees: 320,
      maxAttendees: 400,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      premium: false
    },
    {
      id: 6,
      title: "Pretoria Craft Beer Festival",
      venue: "Union Buildings Grounds",
      location: "Pretoria",
      date: "2024-08-10",
      time: "12:00",
      price: 200,
      category: "Entertainment",
      attendees: 1500,
      maxAttendees: 2000,
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
      premium: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-green-600" />
            Upcoming Events
          </h2>
          <Link to="/events">
            <Button variant="outline" className="hover:scale-105 transition-transform">
              View All Events
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.slice(0, 6).map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {event.price === 0 ? 'FREE' : `R${event.price}`}
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {event.category}
                </div>
                {event.premium && (
                  <div className="absolute bottom-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                    PREMIUM
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{event.venue} • {event.location}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{event.date}</span>
                  <Clock className="w-4 h-4 text-gray-500 ml-3 mr-1" />
                  <span className="text-sm text-gray-600">{event.time}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Users className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    {event.attendees}/{event.maxAttendees} attendees
                  </span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Register Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
