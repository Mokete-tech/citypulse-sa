
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface PaymentFormProps {
  amount: number;
  itemId: string | number;
  itemType: 'deal' | 'event';
  itemName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({
  amount,
  itemId,
  itemType,
  itemName,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Instead of fetching client secret from server, we'll simulate it
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe has not been properly initialized");
      }

      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would use stripe.confirmCardPayment() with a clientSecret

      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Record the payment in database
      const { error: dbError } = await supabase.from('payments').insert({
        id: `demo-${Date.now()}`,
        amount,
        item_id: itemId,
        item_type: itemType,
        item_name: itemName,
        payment_type: 'card',
        email: 'demo@example.com',
        reference_id: `${itemType}-${itemId}`,
        status: 'succeeded'
      });

      if (dbError) {
        console.error("Failed to record payment:", dbError);
        throw new Error("Payment recorded but failed to update database");
      }

      toast.success("Payment successful!", {
        description: `Your payment of R${amount.toFixed(2)} for ${itemName} has been processed.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error("Payment failed", { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded p-3">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button 
          type="button" 
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={onCancel} 
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
