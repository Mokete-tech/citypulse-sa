import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentPackageCard } from '@/components/merchant/PaymentPackageCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MerchantPackages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePaymentSuccess = async (paymentId: string, packageType: string) => {
    if (!user) {
      toast.error('You must be logged in to purchase a package');
      return;
    }

    try {
      // Get the package details
      const [type, variant] = packageType.split('_');

      const { data: packageData, error: packageError } = await supabase
        .from('merchant_packages')
        .select('*')
        .eq('type', type)
        .eq('variant', variant)
        .single();

      if (packageError || !packageData) {
        throw new Error('Failed to find package details');
      }

      // Calculate end date based on package duration
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + packageData.duration_days);

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('merchant_subscriptions')
        .insert({
          merchant_id: user.id,
          package_id: packageData.id,
          payment_intent_id: paymentId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active'
        });

      if (subscriptionError) {
        throw subscriptionError;
      }

      toast.success('Subscription activated!', {
        description: `Your ${packageData.name} package is now active until ${endDate.toLocaleDateString()}.`
      });
    } catch (error) {
      console.error('Error activating subscription:', error);
      toast.error('Failed to activate subscription', {
        description: 'There was an error activating your subscription. Please contact support.'
      });
    }
  };

  // Deal package features
  const dealStandardFeatures = [
    { name: 'Basic listing for 30 days', included: true },
    { name: '7 days featured placement', included: true },
    { name: 'Standard analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: false },
    { name: 'Social media promotion', included: false },
    { name: 'Highlighted in "Popular Deals" section', included: false },
    { name: 'Email marketing inclusion', included: false },
    { name: 'Customer engagement reports', included: false },
  ];

  const dealPremiumFeatures = [
    { name: 'Premium listing for 30 days', included: true },
    { name: '14 days featured placement', included: true },
    { name: 'Advanced analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: true },
    { name: 'Social media promotion', included: true },
    { name: 'Highlighted in "Popular Deals" section', included: true },
    { name: 'Email marketing inclusion', included: true },
    { name: 'Customer engagement reports', included: true },
  ];

  // Event package features
  const eventStandardFeatures = [
    { name: 'Basic listing for 60 days', included: true },
    { name: '7 days featured placement', included: true },
    { name: 'Standard analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: false },
    { name: 'Social media promotion', included: false },
    { name: 'Email newsletter feature', included: false },
    { name: 'Event reminder notifications', included: false },
    { name: 'Attendee interest tracking', included: false },
  ];

  const eventPremiumFeatures = [
    { name: 'Premium listing for 60 days', included: true },
    { name: '21 days featured placement', included: true },
    { name: 'Advanced analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: true },
    { name: 'Social media promotion', included: true },
    { name: 'Email newsletter feature', included: true },
    { name: 'Event reminder notifications', included: true },
    { name: 'Attendee interest tracking', included: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Merchant Packages</h1>

            <div className="mb-8 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">Grow Your Business with CityPulse</h2>
              <p className="text-muted-foreground">
                Choose the right package to reach more customers and boost your visibility in South Africa
              </p>
            </div>

            <Tabs defaultValue="deals" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="deals">Deal Packages</TabsTrigger>
                <TabsTrigger value="events">Event Packages</TabsTrigger>
              </TabsList>

              <TabsContent value="deals" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PaymentPackageCard
                    title="Standard Deal"
                    description="Basic visibility for your deal"
                    price={99}
                    features={dealStandardFeatures}
                    type="deal"
                    variant="standard"
                    onPaymentSuccess={handlePaymentSuccess}
                  />

                  <PaymentPackageCard
                    title="Premium Deal"
                    description="Maximum exposure for your deal"
                    price={250}
                    features={dealPremiumFeatures}
                    popular={true}
                    type="deal"
                    variant="premium"
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                        <path d="M8.5 8.5v.01" />
                        <path d="M16 15.5v.01" />
                        <path d="M12 12v.01" />
                        <path d="M11 17v.01" />
                        <path d="M7 14v.01" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">Reach Local Customers</h3>
                    <p className="text-blue-700 text-sm">
                      Connect with thousands of potential customers in your area who are actively looking for deals like yours.
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M12 20V10" />
                        <path d="M18 20V4" />
                        <path d="M6 20v-6" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-green-800 mb-2">Track Performance</h3>
                    <p className="text-green-700 text-sm">
                      Get detailed analytics on how your deals are performing, including views, clicks, and customer engagement.
                    </p>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M12 2v8" />
                        <path d="m4.93 10.93 1.41 1.41" />
                        <path d="M2 18h2" />
                        <path d="M20 18h2" />
                        <path d="m19.07 10.93-1.41 1.41" />
                        <path d="M22 22H2" />
                        <path d="m16 6-4 4-4-4" />
                        <path d="M16 18a4 4 0 0 0-8 0" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-amber-800 mb-2">Boost Sales</h3>
                    <p className="text-amber-700 text-sm">
                      Our merchants report an average of 27% increase in foot traffic and sales after listing their deals on CityPulse.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PaymentPackageCard
                    title="Standard Event"
                    description="Basic visibility for your event"
                    price={299}
                    features={eventStandardFeatures}
                    type="event"
                    variant="standard"
                    onPaymentSuccess={handlePaymentSuccess}
                  />

                  <PaymentPackageCard
                    title="Premium Event"
                    description="Maximum exposure for your event"
                    price={460}
                    features={eventPremiumFeatures}
                    popular={true}
                    type="event"
                    variant="premium"
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M17 12a5 5 0 0 0-5-5c-2.76 0-5 2.24-5 5s2.24 5 5 5a4.99 4.99 0 0 0 4.9-4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-purple-800 mb-2">Increase Attendance</h3>
                    <p className="text-purple-700 text-sm">
                      Events listed on CityPulse see an average 35% increase in attendance compared to non-listed events.
                    </p>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
                    <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-pink-800 mb-2">Target the Right Audience</h3>
                    <p className="text-pink-700 text-sm">
                      Our platform helps you reach people who are actively looking for events like yours in your area.
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                        <path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3" />
                        <path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83" />
                        <path d="m3 7 3-3 3 3" />
                        <path d="M6 4v3" />
                        <path d="m21 7-3-3-3 3" />
                        <path d="M18 4v3" />
                        <path d="M12 19v2" />
                        <path d="M12 21h8" />
                        <path d="M12 23V19" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-indigo-800 mb-2">Simplified Event Management</h3>
                    <p className="text-indigo-700 text-sm">
                      Track interest, manage visibility, and get insights on your event's performance all in one place.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">How soon will my listing appear?</h4>
                    <p className="text-sm text-gray-600">Your listing will appear immediately after payment is processed. Premium listings are also featured on the homepage right away.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Can I upgrade my package later?</h4>
                    <p className="text-sm text-gray-600">Yes, you can upgrade from Standard to Premium at any time. You'll only pay the difference between the packages.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                    <p className="text-sm text-gray-600">We accept credit cards, PayPal, Apple Pay, Google Pay, and EFT (bank transfer) for all packages.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Can I get a refund?</h4>
                    <p className="text-sm text-gray-600">We offer a 7-day money-back guarantee if you're not satisfied with your listing's performance.</p>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantPackages;
