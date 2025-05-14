import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, DollarSign, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DealCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  merchant: {
    name: string;
    logo?: string;
  };
  location: {
    address: string;
    distance?: string;
  };
  price: {
    original: number;
    discounted: number;
    currency: string;
  };
  category: {
    name: string;
    color: string;
  };
  validUntil: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
}

export const DealCard = ({
  id,
  title,
  description,
  imageUrl,
  merchant,
  location,
  price,
  category,
  validUntil,
  isFeatured = false,
  isNew = false,
  isSaved = false,
  onSave,
  onShare
}: DealCardProps) => {
  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((price.original - price.discounted) / price.original) * 100
  );

  // Format price with currency
  const formatPrice = (amount: number) => {
    return `${price.currency}${amount.toFixed(2)}`;
  };

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg",
      isFeatured && "ring-2 ring-amber-400 ring-offset-2"
    )}>
      {/* Image container with badges */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isFeatured && (
            <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-500">
              Featured
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
              New
            </Badge>
          )}
          <Badge className={cn(
            "text-white",
            category.color
          )}>
            {category.name}
          </Badge>
        </div>
        
        {/* Discount badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            {discountPercentage}% OFF
          </Badge>
        </div>
        
        {/* Save button */}
        <button 
          onClick={onSave}
          className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Merchant info */}
        <div className="flex items-center mb-2">
          {merchant.logo ? (
            <img 
              src={merchant.logo} 
              alt={merchant.name} 
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500">
                {merchant.name.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">{merchant.name}</span>
        </div>
        
        {/* Title and description */}
        <Link to={`/deals/${id}`}>
          <h3 className="text-lg font-semibold mb-1 hover:text-sa-blue transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* Price */}
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-sa-blue mr-2">
            {formatPrice(price.discounted)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(price.original)}
          </span>
        </div>
        
        {/* Location and validity */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span className="truncate">{location.address}</span>
            {location.distance && (
              <span className="ml-1 text-xs text-gray-500">
                ({location.distance})
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>Valid until {validUntil}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex-1 bg-sa-blue hover:bg-sa-blue/90"
            asChild
          >
            <Link to={`/deals/${id}`}>
              View Deal
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
