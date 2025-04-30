import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import ShareButton from '@/components/ui/share-button';
import { Tag } from 'lucide-react';

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
  onClick
}: DealCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 group">
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
                <Tag className="h-3 w-3" /> {category}
              </div>
            )}
            <CardTitle>{title}</CardTitle>
            {merchant_name && <CardDescription>{merchant_name}</CardDescription>}
          </div>

          {featured && (
            <Badge variant="featured" className="ml-2 animate-pulse-scale">Featured</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p>{description}</p>

        {discount && (
          <div className="mt-3">
            <Badge
              variant={discount.includes('Premium') ? 'premium' : 'secondary'}
              className="text-sm font-bold"
            >
              {discount}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <ReactionButton itemId={id} itemType="deal" />

          {expiration_date && (
            <span className="text-sm text-muted-foreground">
              Expires: {expiration_date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ShareButton
            title={title}
            description="deal"
            url={`${window.location.origin}/deals/${id}`}
            size="sm"
            itemId={id}
            itemType="deal"
          />
          <Button size="sm" onClick={onClick}>View Deal</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
