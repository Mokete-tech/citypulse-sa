import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReactionButton } from '@/components/ui/reaction-button';
import { Tag, Share2 } from 'lucide-react';

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
            {category && (
              <div className="text-sm flex items-center gap-1 text-muted-foreground mb-1">
                <Tag className="h-3 w-3" /> {category}
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
          <Button size="sm" variant="ghost" onClick={(e) => {
            e.stopPropagation();
            navigate(`/deals/${id}`);
          }}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
