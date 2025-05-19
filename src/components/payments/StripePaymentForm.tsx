
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';

// Define Window interface with Stripe property
interface StripeWindow extends Window {
  Stripe?: (key: string) => StripeInstance;
}

interface StripeInstance {
  elements: () => any;
  createPaymentMethod: (options: any) => Promise<any>;
}

interface StripePaymentFormProps {
  amount: number;
  itemName: string;
  itemDescription?: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  email: string;
  itemId: string | number;
  itemType: 'deal' | 'event';
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  itemName,
  itemDescription = '',
  onSuccess,
  onCancel,
  email,
  itemId,
  itemType,
}) => {
  const [loading, setLoading] = useState(false);
  const [cardElement, setCardElement] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [nameOnCard, setNameOnCard] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize Stripe
  useEffect(() => {
    // Load Stripe.js script
    if (!document.querySelector('#stripe-js')) {
      const script = document.createElement('script');
      script.id = 'stripe-js';
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = initializeStripe;
      document.body.appendChild(script);
    } else {
      initializeStripe();
    }

    return () => {
      // Clean up card element if it exists
      if (cardElement) {
        cardElement.unmount();
      }
    };
  }, []);

  const initializeStripe = () => {
    const windowWithStripe = window as StripeWindow;
    if (windowWithStripe.Stripe) {
      // Use the publishable key from environment variables
      const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
        'pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN';

      const stripeInstance = windowWithStripe.Stripe(stripePublishableKey);
      setStripe(stripeInstance);

      // Create card element
      const elements = stripeInstance.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });

      // Wait for the next render cycle to ensure the DOM element exists
      setTimeout(() => {
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
          card.mount('#card-element');
          setCardElement(card);
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !cardElement) {
      setError('Stripe has not been initialized. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Create a payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: nameOnCard,
          email: email,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // In a production environment, you would send the payment method ID to your server
      // and create a payment intent. For this demo, we'll simulate a successful payment.

      // Generate a payment ID using the payment method ID
      const paymentId = paymentMethod.id;

      // Record the payment in Supabase
      const { error } = await supabase.from('payments').insert({
        id: paymentId,
        amount,
        email,
        item_name: itemName,
        item_description: itemDescription,
        payment_type: 'Stripe',
        reference_id: `${itemType}-${itemId}`,
        status: 'completed'
      });

      if (error) {
        throw new Error('Failed to record payment');
      }

      // Update the item status in the database
      const { error: updateError } = await supabase
        .from(itemType === 'deal' ? 'deals' : 'events')
        .update({
          status: 'Active',
          paid: true,
          payment_id: paymentId
        })
        .eq('id', itemId);

      if (updateError) {
        throw new Error(`Failed to update ${itemType} status`);
      }

      // Show success message
      toast.success('Payment successful', {
        description: `Your ${itemType} has been activated.`
      });

      // Call the success callback
      onSuccess(paymentId);
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'There was an error processing your payment. Please try again.');
      toast.error('Payment failed', {
        description: error.message || 'There was an error processing your payment. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Enter your card details to pay R{amount.toFixed(2)} for {itemName}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name on card</Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-element">Card details</Label>
            <div
              id="card-element"
              className="border rounded-md p-3 h-10 flex items-center"
            >
              {/* Stripe Card Element will be mounted here */}
            </div>
            {error && (
              <div className="text-sm text-red-500 mt-1">{error}</div>
            )}
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            <p>Test card: 4242 4242 4242 4242</p>
            <p>Use any future expiry date, any 3-digit CVC, and any postal code.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner className="mr-2" /> : null}
            Pay R{amount.toFixed(2)}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
