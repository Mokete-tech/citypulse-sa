
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Share2, MapPin, Clock, Heart } from "lucide-react";
import ReactionButton from "./ReactionButton";

interface DealCardProps {
  title: string;
  category: string;
  business: string;
  description: string;
  discount: string;
  rating: number;
  expires: string;
  featured?: boolean;
  image?: string;
}

const DealCard = ({ 
  title, 
  category, 
  business, 
  description, 
  discount, 
  rating, 
  expires, 
  featured = false,
  image 
}: DealCardProps) => {
  const handleReaction = (type: 'like' | 'dislike', count: number) => {
    console.log(`Deal "${title}" ${type}d. New count: ${count}`);
  };

  const handleViewDeal = () => {
    console.log(`Viewing deal: ${title}`);
    // Add navigation logic here
  };

  const handleShareDeal = () => {
    console.log(`Sharing deal: ${title}`);
    // Add share functionality here
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      {featured && (
        <Badge className="absolute top-3 right-3 bg-orange-500 text-white z-10">
          Featured
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
          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
          <p className="text-blue-600 font-medium">{business}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">{discount}</div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          Expires: {expires}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              className="flex-1 hover:scale-105 transition-transform"
              onClick={handleViewDeal}
            >
              View Deal
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShareDeal}
              className="hover:scale-105 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <ReactionButton 
            type="like" 
            initialCount={Math.floor(Math.random() * 50) + 10}
            onReaction={handleReaction}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
