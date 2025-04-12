import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@shared/schema";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white font-bold">{event.date} • {event.time}</div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-neutral-dark/60">{event.category}</span>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{event.city || "Cape Town"}</span>
        </div>
        <h3 className="font-bold text-xl mb-2">{event.title}</h3>
        <p className="text-neutral-dark/80 mb-4">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold bg-secondary/20 text-secondary px-2 py-1 rounded">
            {event.price ? (event.price.includes("R") ? event.price : `R${event.price}`) : "FREE ENTRY"}
          </span>
          <Link href={`/events/${event.id}`}>
            <a className="text-primary font-medium hover:text-opacity-80 flex items-center">
              Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
