import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { AuthProvider } from "./contexts/AuthContext";
import { PulsePal } from "./components/ai/PulsePal";

// import api/create-payment-intent.ts - won't run directly in StackBlitz

export default function App() {
  return (
    <AuthProvider>
      <div style={{ padding: 16 }}>
        <h1>CityPulse Starter</h1>
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
        <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
      </div>
    </AuthProvider>
  );
}
