import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import { ShareButton } from '@/components/ui/share-button';
import { Tag, MapPin, Share2 } from 'lucide-react';

interface DealCardProps {
  id: number;
  title: string;
  description: string;
  merchant_name?: string;
  category?: string;
  expiration_date?: string;
  discount?: string;
  image_url?: string;
  featured?: boolean;
  distance?: number;
  onClick?: () => void;
}

export function DealCard({
  id,
  title,
  description,
  merchant_name,
  category,
  expiration_date,
  discount,
  image_url,
  featured,
  distance,
  onClick
}: DealCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/deals/${id}`);
    }
  };
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {category && (
                <div className="text-sm flex items-center gap-1 text-muted-foreground">
                  <Tag className="h-3 w-3" /> {category}
                </div>
              )}

              {distance !== undefined && (
                <div className="text-sm flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {distance.toFixed(1)} km
                </div>
              )}
            </div>
            <CardTitle>{title}</CardTitle>
            {merchant_name && <CardDescription>{merchant_name}</CardDescription>}
          </div>

          <div className="flex flex-col items-end gap-2">
            {featured && (
              <Badge variant="outline">Featured</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p>{description}</p>

        {discount && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-sm">
              {discount}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t pt-4">
        <div className="flex items-center gap-2">
          <ReactionButton itemId={id} itemType="deal" />

          {expiration_date && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              Expires: {expiration_date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" onClick={handleClick} className="flex-1 sm:flex-initial">View Deal</Button>
          <ShareButton
            itemId={id}
            itemType="deal"
            title={title}
            description={description}
            size="sm"
            variant="ghost"
            showText={false}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
