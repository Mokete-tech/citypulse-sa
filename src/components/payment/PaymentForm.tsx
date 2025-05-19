import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';
import { formatAmountForDisplay } from '@/integrations/stripe/client';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
  metadata?: Record<string, any>;
}

export function PaymentForm({ 
  amount, 
  description, 
  onSuccess, 
  onCancel,
  metadata = {}
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, isConfigured } = useStripeContext();
  
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

      setIsLoading(true);
      try {
        const { clientSecret, error } = await createPaymentIntent(amount, {
          description,
          ...metadata
        });

        if (error || !clientSecret) {
          throw new Error(error || 'Failed to initialize payment');
        }

        setClientSecret(clientSecret);
      } catch (error: any) {
        console.error('Payment initialization error:', error);
        setPaymentError(error.message || 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [amount, description, createPaymentIntent, isConfigured, metadata]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Use stripe instance to confirm card payment
      // Adding a type assertion to handle the API mismatch
      const stripeWithMethods = stripe as any;
      const { error, paymentIntent } = await stripeWithMethods.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: metadata.customerName || 'CityPulse Customer',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
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

  if (paymentSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful</CardTitle>
          <CardDescription>
            Your payment of {formatAmountForDisplay(amount * 100)} has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => onSuccess && onSuccess('success')}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          {description} - {formatAmountForDisplay(amount * 100)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Card Details
            </label>
            <div className="border rounded-md p-3">
              <CardElement 
                options={{
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
                }}
              />
            </div>
            {paymentError && (
              <p className="text-sm text-red-500">{paymentError}</p>
            )}
          </div>
          
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
        </form>
      </CardContent>
    </Card>
  );
}
