
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, PenLine, Trash2, Video, Image, CreditCard, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import SharingAnalytics from '@/components/dashboard/SharingAnalytics';
import { StripePaymentForm } from '@/components/payments/StripePaymentForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [activeTab, setActiveTab] = useState('deals');
  const [mediaType, setMediaType] = useState('image');
  const [isPremiumAd, setIsPremiumAd] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentDeal, setCurrentPaymentDeal] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    category: '',
    expiresAt: '',
    mediaUrl: '',
    mediaType: 'image',
    isPremium: false,
    location: '',
    discount: '',
  });

  const adPricing = {
    standard: {
      perDeal: 'R99',
      perEvent: 'R299',
    },
    premium: {
      perDeal: 'R250',
      perEvent: 'R460',
    }
  };

  // Sample merchant deals - in a real app, this would come from Firebase
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaTypeChange = (type: string) => {
    setMediaType(type);
    setNewDeal(prev => ({ ...prev, mediaType: type }));
  };

  const handlePremiumToggle = (checked: boolean) => {
    setIsPremiumAd(checked);
    setNewDeal(prev => ({ ...prev, isPremium: checked }));
  };

  const handleAddDeal = () => {
    // In a real app, you'd add the deal to Firebase here
    const newDealWithId = {
      ...newDeal,
      id: Date.now(),
      views: 0,
      status: "Pending Payment"
    };

    setMerchantDeals(prev => [...prev, newDealWithId]);
    toast.success("Deal created!", {
      description: "Your deal has been created and is pending payment.",
    });

    setNewDeal({
      title: '',
      description: '',
      category: '',
      expiresAt: '',
      mediaUrl: '',
      mediaType: 'image',
      isPremium: false,
      location: '',
      discount: '',
    });
    setIsAddingDeal(false);
    // In a real app, would redirect to payment page
  };

  const handleDeleteDeal = (id: number) => {
    // In a real app, you'd delete from Firebase here
    setMerchantDeals(prev => prev.filter(deal => deal.id !== id));
    toast.success("Deal deleted", {
      description: "The deal has been removed from your listings.",
    });
  };

  // Fetch payment history when component mounts
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPayments(data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handlePaymentProcess = (id: number) => {
    const dealToPay = merchantDeals.find(deal => deal.id === id);

    if (!dealToPay) {
      toast.error("Deal not found");
      return;
    }

    // Set the current deal being paid for
    setCurrentPaymentDeal(dealToPay);

    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // Update the deal status
    setMerchantDeals(prev =>
      prev.map(deal =>
        deal.id === currentPaymentDeal?.id ? { ...deal, status: "Active" } : deal
      )
    );

    // Add the payment to the payment history
    const newPayment = {
      id: paymentId,
      created_at: new Date().toISOString(),
      description: currentPaymentDeal?.title,
      amount: currentPaymentDeal?.isPremium ? 250 : 99,
      status: 'Paid'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Close the payment modal
    setShowPaymentModal(false);
    setCurrentPaymentDeal(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          {currentPaymentDeal && (
            <StripePaymentForm
              amount={currentPaymentDeal.isPremium ? 250 : 99}
              itemName={currentPaymentDeal.title}
              itemDescription={`${currentPaymentDeal.isPremium ? 'Premium' : 'Standard'} deal listing`}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentModal(false)}
              email={user?.email || ''}
              itemId={currentPaymentDeal.id}
              itemType="deal"
            />
          )}
        </DialogContent>
      </Dialog>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your deals and view analytics.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="deals">My Deals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
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
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Add New Deal</CardTitle>
                    <CardDescription>
                      Fill out the form below to create a new deal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Deal Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., 20% Off All Products"
                          value={newDeal.title}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Provide details about the deal"
                          value={newDeal.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange('category', value)}
                            value={newDeal.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Beauty">Beauty</SelectItem>
                              <SelectItem value="Entertainment">Entertainment</SelectItem>
                              <SelectItem value="Health">Health & Fitness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            placeholder="e.g., Cape Town Café"
                            value={newDeal.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discount">Discount</Label>
                          <Input
                            id="discount"
                            name="discount"
                            placeholder="e.g., 20% Off, Buy 1 Get 1 Free"
                            value={newDeal.discount}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expiresAt">Expiration Date</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <Input
                              id="expiresAt"
                              name="expiresAt"
                              type="date"
                              value={newDeal.expiresAt}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Media Type</Label>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={mediaType === 'image' ? "default" : "outline"}
                            onClick={() => handleMediaTypeChange('image')}
                            className="flex items-center gap-2"
                          >
                            <Image className="h-4 w-4" /> Image
                          </Button>
                          <Button
                            type="button"
                            variant={mediaType === 'video' ? "default" : "outline"}
                            onClick={() => handleMediaTypeChange('video')}
                            className="flex items-center gap-2"
                          >
                            <Video className="h-4 w-4" /> Video
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mediaUrl">
                          {mediaType === 'image' ? 'Image URL' : 'Video URL'}
                        </Label>
                        <Input
                          id="mediaUrl"
                          name="mediaUrl"
                          placeholder={mediaType === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
                          value={newDeal.mediaUrl}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="border rounded-md p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Premium Advertising</h3>
                            <p className="text-sm text-gray-500">
                              Featured placement and more visibility
                            </p>
                          </div>
                          <Switch
                            checked={isPremiumAd}
                            onCheckedChange={handlePremiumToggle}
                          />
                        </div>

                        {isPremiumAd && (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="border rounded p-3 bg-white text-center">
                              <p className="font-medium">Per Deal</p>
                              <p className="text-lg font-bold">{adPricing.premium.perDeal}</p>
                              <p className="text-xs text-gray-500">Until end of deal</p>
                            </div>
                            <div className="border rounded p-3 bg-white text-center">
                              <p className="font-medium">Per Event</p>
                              <p className="text-lg font-bold">{adPricing.premium.perEvent}</p>
                              <p className="text-xs text-gray-500">Until event date</p>
                            </div>
                          </div>
                        )}

                        {!isPremiumAd && (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="border rounded p-3 bg-white text-center">
                              <p className="font-medium">Per Deal</p>
                              <p className="text-lg font-bold">{adPricing.standard.perDeal}</p>
                              <p className="text-xs text-gray-500">Max 30 days</p>
                            </div>
                            <div className="border rounded p-3 bg-white text-center">
                              <p className="font-medium">Per Event</p>
                              <p className="text-lg font-bold">{adPricing.standard.perEvent}</p>
                              <p className="text-xs text-gray-500">Until event date</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsAddingDeal(false)}>Cancel</Button>
                    <Button onClick={handleAddDeal} className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Continue to Payment
                    </Button>
                  </CardFooter>
                </Card>
              )}

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
                        <div className="bg-gray-100 px-2 py-1 rounded text-sm">
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
                          onClick={() => handlePaymentProcess(deal.id)}
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
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <SharingAnalytics merchantId="current-merchant-id" />

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>
                      Track how your deals are performing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-medium mb-2">Total Views</h3>
                        <p className="text-3xl font-bold">202</p>
                        <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-medium mb-2">Engagement Rate</h3>
                        <p className="text-3xl font-bold">18.5%</p>
                        <p className="text-sm text-muted-foreground mt-1">Clicks / Views</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-medium mb-2">Active Deals</h3>
                        <p className="text-3xl font-bold">{merchantDeals.filter(d => d.status === "Active").length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Currently running</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                        {payments.length > 0 ? (
                          payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-3">
                                {new Date(payment.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                {payment.item_name || payment.description}
                              </td>
                              <td className="px-4 py-3">
                                R{payment.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-green-600">
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">
                              No payment history found
                            </td>
                          </tr>
                        )}

                        {/* Sample payments for demonstration */}
                        {payments.length === 0 && (
                          <>
                            <tr>
                              <td className="px-4 py-3">2025-04-12</td>
                              <td className="px-4 py-3">Premium Deal - 20% Off All Coffee</td>
                              <td className="px-4 py-3">R250</td>
                              <td className="px-4 py-3"><span className="text-green-600">Paid</span></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">2025-03-28</td>
                              <td className="px-4 py-3">Standard Deal - Free Pastry with Coffee</td>
                              <td className="px-4 py-3">R99</td>
                              <td className="px-4 py-3"><span className="text-green-600">Paid</span></td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantDashboard;
