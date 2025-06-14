
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";

const UpcomingEvents = () => {
  const { data: events = [] } = useEvents();
  const upcomingEvents = events.filter(event => event.premium).slice(0, 2);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
