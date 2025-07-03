
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, Share2, Users } from "lucide-react";
import ReactionButton from "./ReactionButton";
import { Event, useEventRegistration } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

const EventCard = ({
  id,
  title,
  category,
  description,
  event_date,
  start_time,
  venue,
  price,
  premium = false,
  image_url,
  max_attendees,
  current_attendees
}: Event) => {
  const { user } = useAuth();
  const eventRegistration = useEventRegistration();
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 30) + 5);

  const handleReaction = (type: 'like' | 'dislike', count: number) => {
    if (!user) {
      toast.error("Sign up required", {
        description: "Please sign up or log in to react to events",
      });
      return;
    }
    
    console.log(`Event "${title}" ${type}d. New count: ${count}`);
    setLikeCount(count);
  };

  const handleViewEvent = () => {
    console.log(`Viewing event: ${title}`);
    // Add navigation logic here
  };

  const handleRegister = () => {
    if (!user) {
      toast.error("Sign up required", {
        description: "Please sign up or log in to register for events",
      });
      return;
    }
    eventRegistration.mutate({ eventId: id });
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  const categoryDisplay = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const spotsLeft = max_attendees ? max_attendees - current_attendees : null;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      {premium && (
        <Badge className="absolute top-3 right-3 bg-purple-500 text-white z-10">
          PREMIUM EVENT
        </Badge>
      )}
      
      {/* Image Section */}
      {image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image_url} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
              {categoryDisplay}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        {!image_url && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {categoryDisplay}
            </Badge>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event_date)}
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Clock className="w-4 h-4 mr-2" />
            {formatTime(start_time)}
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            {venue}
          </div>
          {spotsLeft !== null && (
            <div className="flex items-center text-sm text-orange-600">
              <Users className="w-4 h-4 mr-2" />
              {spotsLeft} spots left
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">{formatPrice(price)}</div>
          <div className="text-sm text-gray-500">
            {current_attendees} attending
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              className="flex-1 hover:scale-105 transition-transform"
              onClick={handleViewEvent}
            >
              View Event
            </Button>
            <Button 
              variant="outline"
              onClick={handleRegister}
              disabled={eventRegistration.isPending || (spotsLeft !== null && spotsLeft <= 0)}
            >
              {eventRegistration.isPending ? 'Registering...' : 'Register'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShareEvent}
              className="hover:scale-105 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          {/* Always show reaction button, but handle auth inside */}
          <ReactionButton 
            type="like" 
            initialCount={likeCount}
            onReaction={handleReaction}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
