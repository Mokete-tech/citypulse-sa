import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import { ShareButton } from '@/components/ui/share-button';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  merchant_name?: string;
  category?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  venue?: string;
  ticket_price?: string;
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
  event_date,
  start_time,
  end_time,
  location,
  venue,
  ticket_price,
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
          {event_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{event_date}</span>
            </div>
          )}

          {(start_time || end_time) && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {start_time && `From ${start_time}`}
                {start_time && end_time && ' to '}
                {end_time && end_time}
              </span>
            </div>
          )}

          {venue && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{venue}</span>
            </div>
          )}

          {location && !venue && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}

          {ticket_price && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-sm">
                {ticket_price}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <ReactionButton itemId={id} itemType="event" />
          <ShareButton
            itemId={id}
            itemType="event"
            title={title}
            description={description}
            imageUrl={image_url}
            variant="outline"
            size="sm"
            showText={false}
          />
        </div>
        <Link to={`/events/${id}`}>
          <Button size="sm" onClick={onClick} className="w-full sm:w-auto">View Event</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
