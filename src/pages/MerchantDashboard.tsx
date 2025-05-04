
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, PenLine, Trash2, CreditCard, Calendar, FileText, Tag, Video, BarChart, Ticket } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { StatementGenerator } from '@/components/merchant/StatementGenerator';
import { AnalyticsDashboard } from '@/components/merchant/AnalyticsDashboard';
import { PaymentIntegration } from '@/components/merchant/PaymentIntegration';
import { DealForm } from '@/components/merchant/DealForm';
import { EventForm } from '@/components/merchant/EventForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [activeTab, setActiveTab] = useState('deals');
  const [isLoading, setIsLoading] = useState(false);

  // Merchant data - in a real app, this would come from Supabase
  const merchantId = user?.id || "merchant-123";
  const merchantName = user?.user_metadata?.full_name || "Cape Town Café";

  // Sample merchant deals
  const [merchantDeals, setMerchantDeals] = useState([
    {
      id: 1,
      title: "20% Off All Coffee",
      description: "Get 20% off any coffee drink, every Tuesday",
      expiresAt: "2025-05-15",
      category: "Food & Drink",
      location: "Cape Town Café",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      isPremium: true,
      discount: "20%",
      views: 124,
      status: "Active"
    },
    {
      id: 2,
      title: "Free Pastry with Coffee",
      description: "Get a free pastry with purchase of any large coffee",
      expiresAt: "2025-05-30",
      category: "Food & Drink",
      location: "Johannesburg Bakery",
      mediaType: "video",
      mediaUrl: "https://example.com/video/pastry-promo.mp4",
      isPremium: false,
      discount: "Buy 1 Get 1 Free",
      views: 78,
      status: "Active"
    },
  ]);

  // Sample merchant events
  const [merchantEvents, setMerchantEvents] = useState([
    {
      id: 1,
      title: "Jazz Night",
      description: "Enjoy a night of smooth jazz with local artists",
      event_date: "2025-06-15",
      start_time: "19:00",
      end_time: "22:00",
      category: "Entertainment",
      location: "Cape Town",
      venue: "Cape Town Jazz Club",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
      isPremium: true,
      ticket_price: "R150",
      views: 89,
      status: "Active"
    },
    {
      id: 2,
      title: "Food Festival",
      description: "Sample the best local cuisine from top chefs",
      event_date: "2025-07-20",
      start_time: "12:00",
      end_time: "20:00",
      category: "Food & Drink",
      location: "Johannesburg",
      venue: "Johannesburg Convention Center",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      isPremium: false,
      ticket_price: "R200",
      views: 156,
      status: "Active"
    },
  ]);

  // Fetch merchant data from Supabase
  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // In a production app, we would fetch real data from Supabase here
        // const { data: deals, error: dealsError } = await supabase
        //   .from('deals')
        //   .select('*')
        //   .eq('merchant_id', user.id);

        // if (dealsError) throw dealsError;
        // setMerchantDeals(deals);

        // const { data: events, error: eventsError } = await supabase
        //   .from('events')
        //   .select('*')
        //   .eq('merchant_id', user.id);

        // if (eventsError) throw eventsError;
        // setMerchantEvents(events);

        // For demo purposes, we'll use the mock data
        console.log('Using mock merchant data for:', user.id);
      } catch (error) {
        console.error('Error fetching merchant data:', error);
        toast.error('Failed to load your merchant data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddDeal = (dealData: any) => {
    // In a real app, you'd add the deal to Supabase here
    const newDealWithId = {
      id: Date.now(),
      title: dealData.title,
      description: dealData.description,
      category: dealData.category,
      expiresAt: dealData.expiresAt.toISOString().split('T')[0],
      startDate: dealData.startDate.toISOString().split('T')[0],
      mediaUrl: dealData.mediaUrl || '',
      mediaType: dealData.mediaType,
      isPremium: dealData.isPremium,
      location: dealData.location,
      discount: dealData.discount,
      views: 0,
      status: "Pending Payment"
    };

    setMerchantDeals(prev => [...prev, newDealWithId]);
    toast.success("Deal created!", {
      description: "Your deal has been created and is pending payment.",
    });

    setIsAddingDeal(false);

    // In a real implementation, we would redirect to payment
    handlePaymentProcess(newDealWithId);
  };

  const handleDeleteDeal = (id: number) => {
    // In a real app, you'd delete from Supabase here
    setMerchantDeals(prev => prev.filter(deal => deal.id !== id));
    toast.success("Deal deleted", {
      description: "The deal has been removed from your listings.",
    });
  };

  const handleAddEvent = (eventData: any) => {
    // In a real app, you'd add the event to Supabase here
    const newEventWithId = {
      id: Date.now(),
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      event_date: eventData.event_date.toISOString().split('T')[0],
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      venue: eventData.venue,
      mediaUrl: eventData.image_url || '',
      mediaType: 'image',
      isPremium: eventData.is_premium,
      ticket_price: eventData.ticket_price,
      views: 0,
      status: "Pending Payment"
    };

    setMerchantEvents(prev => [...prev, newEventWithId]);
    toast.success("Event created!", {
      description: "Your event has been created and is pending payment.",
    });

    setIsAddingEvent(false);

    // In a real implementation, we would redirect to payment
    handlePaymentProcess({...newEventWithId, itemType: 'event'});
  };

  const handleDeleteEvent = (id: number) => {
    // In a real app, you'd delete from Supabase here
    setMerchantEvents(prev => prev.filter(event => event.id !== id));
    toast.success("Event deleted", {
      description: "The event has been removed from your listings.",
    });
  };

  const [showPayment, setShowPayment] = useState(false);
  const [selectedDealForPayment, setSelectedDealForPayment] = useState<any>(null);

  const handlePaymentProcess = (deal: any) => {
    setSelectedDealForPayment(deal);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Check if it's a deal or an event
    if (selectedDealForPayment.itemType === 'event') {
      // Update the event status
      setMerchantEvents(prev =>
        prev.map(event =>
          event.id === selectedDealForPayment.id ? { ...event, status: "Active" } : event
        )
      );
    } else {
      // Update the deal status
      setMerchantDeals(prev =>
        prev.map(deal =>
          deal.id === selectedDealForPayment.id ? { ...deal, status: "Active" } : deal
        )
      );
    }

    // Calculate the amount paid
    const amountPaid = selectedDealForPayment.isPremium ? 'R499' : 'R199';

    toast.success("Payment successful!", {
      description: `${amountPaid} payment completed. Transaction ID: ${transactionId}`,
    });

    // Hide payment form after success
    setTimeout(() => {
      setShowPayment(false);
      setSelectedDealForPayment(null);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {showPayment && selectedDealForPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <PaymentIntegration
              amount={selectedDealForPayment.isPremium ? 499 : 199}
              itemId={selectedDealForPayment.id.toString()}
              itemType="deal"
              itemTitle={selectedDealForPayment.title}
              merchantId={merchantId}
              merchantName={merchantName}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              Manage your deals and view analytics.
            </p>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Active Deals</p>
                      <h3 className="text-2xl font-bold mt-1">{merchantDeals.filter(d => d.status === "Active").length}</h3>
                    </div>
                    <div className="bg-blue-200 p-2 rounded-full">
                      <Tag className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-blue-600">
                    <span className="font-medium">124</span> views this week
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-green-600">Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">R 1,250</h3>
                    </div>
                    <div className="bg-green-200 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-green-700" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-600">
                    <span className="font-medium">+12%</span> from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Engagement</p>
                      <h3 className="text-2xl font-bold mt-1">86%</h3>
                    </div>
                    <div className="bg-purple-200 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-purple-700" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-purple-600">
                    <span className="font-medium">202</span> customer interactions
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Upcoming</p>
                      <h3 className="text-2xl font-bold mt-1">2</h3>
                    </div>
                    <div className="bg-amber-200 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-amber-600">
                    <span className="font-medium">1</span> expiring this week
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="deals">My Deals</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
            </TabsList>

            <TabsContent value="deals" className="space-y-6">
              <div className="mb-6">
                <Button
                  onClick={() => setIsAddingDeal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add New Deal
                </Button>
              </div>

              {isAddingDeal && (
                <div className="mb-8">
                  <DealForm
                    merchantId={merchantId}
                    merchantName={merchantName}
                    onSubmit={handleAddDeal}
                    onCancel={() => setIsAddingDeal(false)}
                  />
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {merchantDeals.map(deal => (
                    <Card key={deal.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{deal.title}</CardTitle>
                            <CardDescription>
                              {deal.location} • {deal.category}
                              {deal.isPremium && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  Premium
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <div className={`px-2 py-1 rounded text-sm ${
                            deal.status === "Active" ? "bg-green-100 text-green-800" :
                            deal.status === "Pending Payment" ? "bg-amber-100 text-amber-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {deal.status}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          {deal.mediaType === 'image' ? (
                            <img
                              src={deal.mediaUrl}
                              alt={deal.title}
                              className="w-full h-40 object-cover rounded-md"
                            />
                          ) : (
                            <div className="relative w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                              <Video className="h-12 w-12 text-gray-400" />
                              <p className="absolute bottom-2 right-2 text-sm bg-black/50 text-white px-2 py-1 rounded">
                                Video Ad
                              </p>
                            </div>
                          )}
                        </div>

                        <p className="mb-3">{deal.description}</p>

                        <div className="flex flex-wrap gap-2 text-sm mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            {deal.discount}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Expires: {new Date(deal.expiresAt).toLocaleDateString()}
                          </div>
                          <div className="font-medium">
                            {deal.views} views
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        {deal.status === "Pending Payment" ? (
                          <Button
                            onClick={() => handlePaymentProcess(deal)}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" /> Complete Payment
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <PenLine className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleDeleteDeal(deal.id)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="mb-6">
                <Button
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add New Event
                </Button>
              </div>

              {isAddingEvent && (
                <div className="mb-8">
                  <EventForm
                    onSubmit={handleAddEvent}
                    onCancel={() => setIsAddingEvent(false)}
                  />
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {merchantEvents.map(event => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              {event.venue} • {event.category}
                              {event.isPremium && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  Premium
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <div className={`px-2 py-1 rounded text-sm ${
                            event.status === "Active" ? "bg-green-100 text-green-800" :
                            event.status === "Pending Payment" ? "bg-amber-100 text-amber-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {event.status}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          {event.mediaType === 'image' ? (
                            <img
                              src={event.mediaUrl}
                              alt={event.title}
                              className="w-full h-40 object-cover rounded-md"
                            />
                          ) : (
                            <div className="relative w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                              <Video className="h-12 w-12 text-gray-400" />
                              <p className="absolute bottom-2 right-2 text-sm bg-black/50 text-white px-2 py-1 rounded">
                                Video Ad
                              </p>
                            </div>
                          )}
                        </div>

                        <p className="mb-3">{event.description}</p>

                        <div className="flex flex-wrap gap-2 text-sm mb-3">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                            {event.ticket_price || 'Free'}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.event_date).toLocaleDateString()} at {event.start_time}
                          </div>
                          <div className="font-medium">
                            {event.views} views
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        {event.status === "Pending Payment" ? (
                          <Button
                            onClick={() => handlePaymentProcess({...event, itemType: 'event'})}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" /> Complete Payment
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <PenLine className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard merchantId={merchantId} />
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View your past payments and invoices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Description</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3">2025-04-12</td>
                          <td className="px-4 py-3">Premium Ad - 20% Off All Coffee</td>
                          <td className="px-4 py-3">R499</td>
                          <td className="px-4 py-3"><span className="text-green-600">Paid</span></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">2025-03-28</td>
                          <td className="px-4 py-3">Standard Ad - Free Pastry with Coffee</td>
                          <td className="px-4 py-3">R199</td>
                          <td className="px-4 py-3"><span className="text-green-600">Paid</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statements">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Financial Statements</h2>
                    <p className="text-muted-foreground">
                      Generate and download statements for your business
                    </p>
                  </div>
                  <Button className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> View All Statements
                  </Button>
                </div>

                <StatementGenerator
                  merchantId={merchantId}
                  merchantName={merchantName}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Statements</CardTitle>
                    <CardDescription>
                      Your previously generated statements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left">Date Generated</th>
                            <th className="px-4 py-3 text-left">Period</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="px-4 py-3">2025-04-15</td>
                            <td className="px-4 py-3">March 2025</td>
                            <td className="px-4 py-3">Detailed</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3.5 w-3.5 mr-1" /> View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Email
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">2025-03-10</td>
                            <td className="px-4 py-3">February 2025</td>
                            <td className="px-4 py-3">Summary</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3.5 w-3.5 mr-1" /> View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Email
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantDashboard;
