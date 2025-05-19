
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { ResponsiveLayout } from "./components/layout/ResponsiveLayout";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { EnvWarning } from "./components/ui/env-warning";
import { Package, Building, Search, Calendar, MapPin, HeartHandshake } from "lucide-react";

export default function App() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = React.useState("signin");

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is not authenticated, show sign-in/sign-up form
  if (!user) {
    return (
      <ResponsiveLayout showFooter={false} className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="p-6 max-w-6xl w-full bg-white rounded-lg shadow-lg">
            <EnvWarning />
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg mb-4">
                    <HeartHandshake className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">CityPulse</h1>
                  <p className="text-base md:text-lg text-gray-600 mb-6">Discover the best local deals and events across South Africa</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="bg-blue-100 p-2 inline-flex rounded-full mb-2">
                        <Package className="h-5 w-5 text-blue-700" />
                      </div>
                      <h3 className="font-medium">1000+ Deals</h3>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="bg-purple-100 p-2 inline-flex rounded-full mb-2">
                        <Calendar className="h-5 w-5 text-purple-700" />
                      </div>
                      <h3 className="font-medium">500+ Events</h3>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="bg-green-100 p-2 inline-flex rounded-full mb-2">
                        <Building className="h-5 w-5 text-green-700" />
                      </div>
                      <h3 className="font-medium">300+ Merchants</h3>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <div className="bg-amber-100 p-2 inline-flex rounded-full mb-2">
                        <MapPin className="h-5 w-5 text-amber-700" />
                      </div>
                      <h3 className="font-medium">25+ Cities</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 mt-4 text-sm hidden md:block">
                    Join thousands of South Africans who use CityPulse to discover local deals,
                    exciting events, and connect with businesses in their area.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <SignIn routing="path" path="/" afterSignInUrl="/" />
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <SignUp routing="path" path="/" afterSignUpUrl="/" />
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium mb-2 text-sm text-gray-600">Are you a business owner?</h4>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/merchant/login">
                      <Building className="h-4 w-4 mr-2" />
                      Merchant Login
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // User is authenticated, show the main app
  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
  };

  return (
    <ResponsiveLayout>
      <div className="p-6">
        <EnvWarning />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">CityPulse Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="px-4 py-2"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DealsCrud />
          </div>
          
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Payment Demo
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={150}
                  itemId="demo-deal-1"
                  itemType="deal"
                  itemName="Jazz Night"
                  onSuccess={() => toast.success("Payment successful!")}
                  onCancel={() => toast.info("Payment cancelled")}
                />
              </Elements>
            </div>
            
            <PaymentsList />
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-8">
          <div className="border rounded-lg bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
              <h2 className="text-white text-xl font-bold">CityPulse AI Assistant</h2>
              <p className="text-white text-opacity-90">Ask our AI about local deals, events or get personalized recommendations</p>
            </div>
            <div className="p-6">
              <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
