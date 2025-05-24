import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentPackageCard } from '@/components/merchant/PaymentPackageCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PulsePal } from '@/components/ai/PulsePal';
import { EnvWarning } from '@/components/ui/env-warning';
import { CalendarCheck, Building, HandCoins, Trophy, MapPin, Users, Store, Calendar, Megaphone, Zap } from 'lucide-react';

const MerchantPackages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Environment Warning */}
          <EnvWarning />
          
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Merchant Packages</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Boost your business visibility with CityPulse premium packages and connect with thousands of potential customers in South Africa
              </p>
            </div>

            {/* Hero section with image */}
            <div className="relative rounded-xl overflow-hidden mb-10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2400" 
                alt="Merchant Success" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/50 flex items-center">
                <div className="px-8 text-white max-w-xl">
                  <h2 className="text-3xl font-bold mb-2">Grow Your Business</h2>
                  <p className="text-lg opacity-90">Join thousands of successful merchants already using CityPulse to reach new customers.</p>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Users</p>
                    <p className="text-xl font-bold">45,000+</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Building className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Businesses</p>
                    <p className="text-xl font-bold">3,200+</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <CalendarCheck className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Events Listed</p>
                    <p className="text-xl font-bold">12,500+</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cities Covered</p>
                    <p className="text-xl font-bold">25+</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="deals" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="deals" className="text-base py-3">
                  <HandCoins className="h-4 w-4 mr-2" />
                  Deal Packages
                </TabsTrigger>
                <TabsTrigger value="events" className="text-base py-3">
                  <Trophy className="h-4 w-4 mr-2" />
                  Event Packages
                </TabsTrigger>
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
                    imageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2400"
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
                    imageSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2400"
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
                  <h3 className="font-medium text-blue-800 text-xl mb-3">Why list your deal on CityPulse?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Reach Thousands</h4>
                        <p className="text-sm text-blue-700">Connect with over 45,000 active monthly users looking for local deals.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Local Targeting</h4>
                        <p className="text-sm text-blue-700">Our geo-location features connect you with nearby customers.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <Store className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Boost Sales</h4>
                        <p className="text-sm text-blue-700">Merchants report an average 32% increase in sales after listing deals.</p>
                      </div>
                    </div>
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
                    imageSrc="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2400"
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
                    imageSrc="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2400"
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm">
                  <h3 className="font-medium text-purple-800 text-xl mb-3">Why promote your event on CityPulse?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Event Spotlight</h4>
                        <p className="text-sm text-purple-700">Get featured in our weekly event highlights seen by thousands.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Targeted Audience</h4>
                        <p className="text-sm text-purple-700">Reach people specifically searching for events in your area.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                        <Megaphone className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Wider Reach</h4>
                        <p className="text-sm text-purple-700">Share events across multiple platforms with our integrated tools.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Testimonials Section */}
            <div className="my-12 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4">
                <h2 className="text-white text-xl font-bold">Success Stories</h2>
                <p className="text-white text-opacity-90">See what our merchants are saying</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">JM</div>
                      <div>
                        <h4 className="font-medium">James Mokoena</h4>
                        <p className="text-sm text-gray-600">Restaurant Owner, Johannesburg</p>
                      </div>
                    </div>
                    <p className="italic text-gray-600">"Our weekend specials promotion received 3x more bookings after being featured on CityPulse. The analytics dashboard made it easy to track our ROI."</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold mr-3">SN</div>
                      <div>
                        <h4 className="font-medium">Sarah Naidoo</h4>
                        <p className="text-sm text-gray-600">Event Planner, Cape Town</p>
                      </div>
                    </div>
                    <p className="italic text-gray-600">"The Premium Event package was worth every cent. Our festival sold out two weeks before the date thanks to the exposure on CityPulse."</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Assistant Section */}
            <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">Need Help Choosing?</h2>
                    <p className="text-white text-opacity-90">Ask our AI assistant for personalized recommendations</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantPackages;
