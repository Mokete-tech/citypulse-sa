import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SidebarLayout } from "./components/layout/SidebarLayout";

export default function App() {
  const user = useUser();
  const { signOut } = useClerk();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: 16 }}>
        <h1>CityPulse Starter - Please Sign In</h1>
        <button onClick={() => setShowSignIn(true)} style={{ padding: "10px 20px", fontSize: 16 }}>
          Sign In
        </button>
        <button onClick={() => setShowSignUp(true)} style={{ padding: "10px 20px", fontSize: 16, marginLeft: 10 }}>
          Sign Up
        </button>
        {showSignIn && (
          <div>
            {/* Render Clerk SignIn component or redirect */}
            <p>SignIn component placeholder</p>
            <button onClick={() => setShowSignIn(false)}>Close</button>
          </div>
        )}
        {showSignUp && (
          <div>
            {/* Render Clerk SignUp component or redirect */}
            <p>SignUp component placeholder</p>
            <button onClick={() => setShowSignUp(false)}>Close</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <SidebarLayout sidebar={<PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />}>
      <div>
        <h1>CityPulse Starter</h1>
        <button onClick={() => signOut()} style={{ marginBottom: 20 }}>
          Sign Out
        </button>
        <DealsCrud />
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={150}
            itemId="demo-deal-1"
            itemType="deal"
            itemName="Jazz Night"
          />
        </Elements>
        <PaymentsList />
      </div>
    </SidebarLayout>
  );
}
