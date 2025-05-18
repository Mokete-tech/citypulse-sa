import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { useClerkAuth } from "./contexts/ClerkAuthContext";

export default function App() {
  const [isPulsePalOpen, setIsPulsePalOpen] = useState(false);
  const { user, signIn, signOut } = useClerkAuth();

  const openPulsePal = () => setIsPulsePalOpen(true);
  const closePulsePal = () => setIsPulsePalOpen(false);

  if (!user) {
    return (
      <div style={{ padding: 16 }}>
        <h1>CityPulse Starter - Please Sign In</h1>
        <button onClick={() => signIn.open()} style={{ padding: "10px 20px", fontSize: 16 }}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
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
      <button
        onClick={openPulsePal}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#673ab7",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Open PulsePal AI Assistant
      </button>

      {isPulsePalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closePulsePal}
        >
          <div
            style={{ backgroundColor: "#f5f3ff", borderRadius: 12, padding: 20, maxWidth: 600, width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePulsePal}
              style={{
                float: "right",
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                marginBottom: 10,
              }}
              aria-label="Close PulsePal"
            >
              &times;
            </button>
            <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
          </div>
        </div>
      )}
    </div>
  );
}
