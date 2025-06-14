
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Share2, MapPin, Clock, Heart } from "lucide-react";
import ReactionButton from "./ReactionButton";
import { Deal, useFavoriteToggle, useReactionToggle } from "@/hooks/useDeals";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DealCardProps extends Deal {}

const DealCard = ({ 
  id,
  title, 
  category, 
  businesses,
  description, 
  discount_text, 
  original_price,
  discounted_price,
  expires_at, 
  featured = false,
  image_url 
}: DealCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const favoriteToggle = useFavoriteToggle();
  const reactionToggle = useReactionToggle();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);

  const handleReaction = (type: 'like' | 'dislike', count: number) => {
    if (!user) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to react to deals",
        variant: "destructive"
      });
      return;
    }
    
    reactionToggle.mutate({ dealId: id, reactionType: type });
    setIsLiked(type === 'like' ? !isLiked : false);
    setLikeCount(count);
  };

  const handleViewDeal = () => {
    console.log(`Viewing deal: ${title}`);
    // Add navigation logic here
  };

  const handleShareDeal = () => {
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
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const categoryDisplay = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Card className="relative overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      {featured && (
        <Badge className="absolute top-3 right-3 bg-orange-500 text-white z-10">
          Featured
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
        
        <div className="flex items-center mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
          <p className="text-blue-600 font-medium">{businesses.name}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-green-600">{discount_text}</div>
            {discounted_price && (
              <div className="text-sm text-gray-500">
                <span className="line-through">{formatPrice(original_price)}</span>
                <span className="ml-2 text-green-600 font-bold">{formatPrice(discounted_price)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{businesses.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          Expires: {formatDate(expires_at)}
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

export default DealCard;
