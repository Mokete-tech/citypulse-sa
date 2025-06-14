
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Share2 } from "lucide-react";

interface DealCardProps {
  title: string;
  category: string;
  business: string;
  description: string;
  discount: string;
  rating: number;
  expires: string;
  featured?: boolean;
}

const DealCard = ({ title, category, business, description, discount, rating, expires, featured = false }: DealCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {featured && (
        <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
          Featured
        </Badge>
      )}
      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-blue-600 font-medium mb-3">{business}</p>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">{discount}</div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Expires: {expires}
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1">View Deal</Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
