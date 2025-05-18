import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from "../integrations/supabase/client";

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ amount, currency: 'zar', metadata: { itemId, itemType, itemName } }),
    })
    .then(res => res.json())
    .then(data => setClientSecret(data.clientSecret))
    .catch(error => setError(error.message || 'Failed to fetch client secret'));
  }, [amount, itemId, itemType, itemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        await supabase.from('payments').insert({
          amount,
          item_id: itemId,
          item_type: itemType,
          item_name: itemName,
          payment_intent_id: paymentIntent.id,
          status: 'succeeded'
        });
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onCancel} disabled={isProcessing}>Cancel</button>
        <button type="submit" disabled={isProcessing || !stripe}>
          {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
