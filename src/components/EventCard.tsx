
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, Share2, Users } from "lucide-react";
import ReactionButton from "./ReactionButton";

interface EventCardProps {
  title: string;
  category: string;
  organizer: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  rating: number;
  premium?: boolean;
  image?: string;
}

const EventCard = ({ 
  title, 
  category, 
  organizer, 
  description, 
  date, 
  time, 
  venue, 
  price, 
  rating, 
  premium = false,
  image 
}: EventCardProps) => {
  const handleReaction = (type: 'like' | 'dislike', count: number) => {
    console.log(`Event "${title}" ${type}d. New count: ${count}`);
  };

  const handleViewEvent = () => {
    console.log(`Viewing event: ${title}`);
    // Add navigation logic here
  };

  const handleShareEvent = () => {
    console.log(`Sharing event: ${title}`);
    // Add share functionality here
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      {premium && (
        <Badge className="absolute top-3 right-3 bg-purple-500 text-white z-10">
          PREMIUM EVENT
        </Badge>
      )}
      
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
              {category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        {!image && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center mb-3">
          <Users className="w-4 h-4 text-gray-500 mr-1" />
          <p className="text-blue-600 font-medium">{organizer}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            {date}
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <Clock className="w-4 h-4 mr-2" />
            {time}
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            {venue}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">{price}</div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
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
              size="icon"
              onClick={handleShareEvent}
              className="hover:scale-105 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <ReactionButton 
            type="like" 
            initialCount={Math.floor(Math.random() * 30) + 5}
            onReaction={handleReaction}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
