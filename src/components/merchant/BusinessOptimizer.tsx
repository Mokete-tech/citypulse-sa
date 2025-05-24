import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Calendar, Fire } from 'lucide-react';

const BusinessOptimizer = () => {
  const deals = [
    {
      id: '1',
      title: 'Flash Sale: Fresh Produce',
      description: 'Get 30% off on all fresh fruits and vegetables',
      discount: '30% OFF',
      validUntil: '2024-03-20',
      category: 'flash'
    },
    {
      id: '2',
      title: 'Weekly Special: Premium Meats',
      description: 'Buy any premium cut and get a free marinade',
      discount: 'Free Gift',
      validUntil: '2024-03-25',
      category: 'weekly'
    },
    {
      id: '3',
      title: 'Monthly Bundle: Family Pack',
      description: 'Complete family grocery bundle at 25% off',
      discount: '25% OFF',
      validUntil: '2024-04-01',
      category: 'monthly'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Wine Tasting Evening',
      description: 'Join us for an evening of fine wines and cheese pairings',
      date: '2024-03-25',
      time: '6:00 PM - 8:00 PM',
      location: 'Store Tasting Room',
      category: 'tasting'
    },
    {
      id: '2',
      title: 'Cooking Workshop',
      description: 'Learn to cook with seasonal ingredients',
      date: '2024-03-28',
      time: '2:00 PM - 4:00 PM',
      location: 'Store Kitchen',
      category: 'workshop'
    },
    {
      id: '3',
      title: 'Weekend Sale Event',
      description: 'Special weekend discounts on selected items',
      date: '2024-03-30',
      time: '10:00 AM - 6:00 PM',
      location: 'Main Store',
      category: 'sale'
    }
  ];

  return (
    <div className="p-6">
      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deals">Deals & Offers</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="deals">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Current Deals</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <Badge variant={deal.category === 'flash' ? 'destructive' : 'default'}>
                        {deal.category === 'flash' ? <Fire className="h-4 w-4 mr-1" /> : null}
                        {deal.category.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span>{deal.discount}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Valid until: {deal.validUntil}
                      </div>
                    </div>
                    <Button className="w-full">Manage Deal</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="default">
                        {event.category.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{event.date} at {event.time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Location: {event.location}
                      </div>
                    </div>
                    <Button className="w-full">Manage Event</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOptimizer; 