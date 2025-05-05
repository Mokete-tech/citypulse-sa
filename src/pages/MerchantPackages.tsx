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
  ];

  const dealPremiumFeatures = [
    { name: 'Premium listing for 30 days', included: true },
    { name: '14 days featured placement', included: true },
    { name: 'Advanced analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: true },
    { name: 'Social media promotion', included: true },
  ];

  // Event package features
  const eventStandardFeatures = [
    { name: 'Basic listing for 60 days', included: true },
    { name: '7 days featured placement', included: true },
    { name: 'Standard analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: false },
    { name: 'Social media promotion', included: false },
    { name: 'Email newsletter feature', included: false },
  ];

  const eventPremiumFeatures = [
    { name: 'Premium listing for 60 days', included: true },
    { name: '21 days featured placement', included: true },
    { name: 'Advanced analytics dashboard', included: true },
    { name: 'Priority placement in search results', included: true },
    { name: 'Social media promotion', included: true },
    { name: 'Email newsletter feature', included: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Merchant Packages</h1>
            <p className="text-muted-foreground mb-6">
              Choose the right package to promote your deals and events on CityPulse
            </p>

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

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Why list your deal on CityPulse?</h3>
                  <p className="text-blue-700 text-sm">
                    Reach thousands of potential customers in your area. Our platform connects local businesses with eager shoppers looking for the best deals in South Africa.
                  </p>
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

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">Why promote your event on CityPulse?</h3>
                  <p className="text-purple-700 text-sm">
                    Get your event noticed by thousands of potential attendees. Our platform helps event organizers connect with people looking for exciting events in South Africa.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantPackages;
