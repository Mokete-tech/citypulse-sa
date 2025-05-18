
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
      <ResponsiveLayout showFooter={false} className="bg-gray-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to CityPulse</h1>
              <p className="text-sm text-gray-600 mt-2">Discover the best local deals and events across South Africa</p>
            </div>
            
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">CityPulse Starter</h1>
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
              <h2 className="text-xl font-semibold mb-4">Payment Demo</h2>
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

        {/* AI Assistant */}
        <div className="mt-8">
          <div className="border rounded-lg bg-white shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4">CityPulse AI Assistant</h2>
            <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
