import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';
import { formatAmountForDisplay } from '@/integrations/stripe/client';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentFormProps {
  amount: number;
  description: string;
  itemId: string | number;
  itemType: 'deal' | 'event';
  itemName: string;
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
  metadata?: Record<string, any>;
}

export function PaymentForm({ 
  amount, 
  description,
  itemId,
  itemType,
  itemName,
  onSuccess, 
  onCancel,
  metadata = {}
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, isConfigured } = useStripeContext();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Create payment intent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      if (!isConfigured) {
        setPaymentError('Payment system is not configured');
        return;
      }

      if (!user) {
        setPaymentError('You must be logged in to make a payment');
        return;
      }

      setIsLoading(true);
      try {
        const { clientSecret, error } = await createPaymentIntent(amount, {
          description,
          itemId,
          itemType,
          itemName,
          userId: user.id,
          userEmail: user.email,
          ...metadata
        });

        if (error || !clientSecret) {
          throw new Error(error || 'Failed to initialize payment');
        }

        setClientSecret(clientSecret);
      } catch (error: any) {
        console.error('Payment initialization error:', error);
        setPaymentError(error.message || 'Failed to initialize payment');
        toast.error('Payment initialization failed', {
          description: error.message || 'Failed to initialize payment'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [amount, description, createPaymentIntent, isConfigured, metadata, user, itemId, itemType, itemName]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || !user) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.user_metadata?.full_name || 'CityPulse Customer',
            email: user.email,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        // Record the payment in Supabase
        const { error: dbError } = await supabase.from('payments').insert({
          id: paymentIntent.id,
          user_id: user.id,
          amount,
          currency: 'ZAR',
          payment_method: 'card',
          status: 'succeeded',
          item_type: itemType,
          item_id: itemId,
          item_name: itemName,
          payment_intent_id: paymentIntent.id,
          metadata: {
            ...metadata,
            payment_intent_status: paymentIntent.status
          }
        });

        if (dbError) {
          console.error('Error recording payment:', dbError);
          throw new Error('Payment succeeded but failed to record in database');
        }

        setPaymentSuccess(true);
        toast.success('Payment successful!', {
          description: `Your payment of ${formatAmountForDisplay(amount * 100)} has been processed.`
        });
        
        if (onSuccess) {
          onSuccess(paymentIntent.id);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed');
      toast.error('Payment failed', {
        description: error.message || 'There was an issue processing your payment. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Unavailable</CardTitle>
          <CardDescription>
            The payment system is currently unavailable. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in to complete your payment.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (paymentSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onSuccess}>Continue</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
          {paymentError && (
            <div className="text-red-500 text-sm">{paymentError}</div>
          )}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!stripe || !elements || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ${formatAmountForDisplay(amount * 100)}`
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
