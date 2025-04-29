
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  category?: string;
  link?: string;
}

const InsightCard = ({ title, date, description, imageUrl, category, link = "#" }: InsightCardProps) => {
  return (
    <Card className="overflow-hidden animate-fade-in flex flex-col">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        {category && (
          <div className="text-xs font-medium text-primary mb-1">{category}</div>
        )}
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="text-xs text-muted-foreground">{date}</div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      
      <CardFooter>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0" asChild>
          <a href={link} className="flex items-center gap-1">
            <span>Read more</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightCard;
