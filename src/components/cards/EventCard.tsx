import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  merchant_name?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  price?: string;
  image_url?: string;
  featured?: boolean;
  onClick?: () => void;
}

export function EventCard({
  id,
  title,
  description,
  merchant_name,
  category,
  date,
  time,
  location,
  price,
  image_url,
  featured,
  onClick
}: EventCardProps) {
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
            {category && (
              <div className="text-sm text-muted-foreground mb-1">
                {category}
              </div>
            )}
            <CardTitle>{title}</CardTitle>
            {merchant_name && <CardDescription>{merchant_name}</CardDescription>}
          </div>
          
          {featured && (
            <Badge variant="outline" className="ml-2">Featured</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p>{description}</p>
        
        <div className="mt-4 space-y-2">
          {date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{date} {time && `at ${time}`}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          
          {price && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-sm">
                {price}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center border-t pt-4">
        <ReactionButton itemId={id} itemType="event" />
        <Button size="sm" onClick={onClick}>View Event</Button>
      </CardFooter>
    </Card>
  );
}
