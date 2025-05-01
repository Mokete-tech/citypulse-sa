import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import ShareButton from '@/components/ui/share-button';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';

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
    <Card className={`h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg group ${featured ? 'border-purple-300 shadow-md' : 'hover:border-primary/20'}`}>
      {featured && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xs font-bold px-3 py-1 flex items-center justify-center">
          <Star className="h-3 w-3 mr-1 fill-white" /> PREMIUM EVENT
        </div>
      )}

      {image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            {category && (
              <div className="text-sm flex items-center gap-1 text-muted-foreground mb-1">
                {category}
              </div>
            )}
            <CardTitle>{title}</CardTitle>
            {merchant_name && <CardDescription>{merchant_name}</CardDescription>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p>{description}</p>

        <div className="mt-4 space-y-2">
          {date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{date}</span>
            </div>
          )}

          {time && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{time}</span>
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
              <Badge
                variant={featured ? 'premium' : 'secondary'}
                className="text-sm font-bold"
              >
                {price}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center border-t pt-4">
        <ReactionButton itemId={id} itemType="event" />
        <div className="flex items-center gap-2">
          <ShareButton
            title={title}
            description="event"
            url={`${window.location.origin}/events/${id}`}
            size="sm"
            itemId={id}
            itemType="event"
          />
          <Button size="sm" onClick={onClick} variant={featured ? "default" : "outline"}>View Event</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
