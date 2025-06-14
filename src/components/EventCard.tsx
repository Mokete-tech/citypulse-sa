
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, Share2 } from "lucide-react";
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
}

const EventCard = ({ title, category, organizer, description, date, time, venue, price, rating, premium = false }: EventCardProps) => {
  const handleReaction = (type: 'like' | 'dislike', count: number) => {
    console.log(`Event "${title}" ${type}d. New count: ${count}`);
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {premium && (
        <Badge className="absolute top-3 right-3 bg-purple-500 text-white">
          PREMIUM EVENT
        </Badge>
      )}
      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-blue-600 font-medium mb-3">{organizer}</p>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {date}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
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
            <Button className="flex-1">View Event</Button>
            <Button variant="outline" size="icon">
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
