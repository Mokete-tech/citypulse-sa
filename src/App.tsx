
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SidebarLayout } from "./components/layout/SidebarLayout";
import { toast } from "sonner";

export default function App() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [showSignUp, setShowSignUp] = React.useState(false);

  // Handle Clerk authentication
  if (!user) {
    return (
      <div className="p-6 max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">CityPulse Starter - Please Sign In</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowSignIn(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          
          <button
            onClick={() => setShowSignUp(true)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </button>
        </div>
        
        {showSignIn && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Sign In</h2>
            <p className="mb-4">SignIn component placeholder</p>
            <button 
              onClick={() => setShowSignIn(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        )}
        
        {showSignUp && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
            <p className="mb-4">SignUp component placeholder</p>
            <button 
              onClick={() => setShowSignUp(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
  };

  return (
    <SidebarLayout sidebar={<PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">CityPulse Starter</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Sign Out
          </button>
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
      </div>
    </SidebarLayout>
  );
}
