import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Get Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

/**
 * Stripe payment form component
 */
const StripePaymentForm = ({
  amount,
  currency = 'zar',
  description = 'Payment for services',
  onPaymentSuccess,
  onPaymentError,
  buttonText = 'Pay Now',
  className = '',
}: StripePaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardElement, setCardElement] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');

  // Load Stripe.js
  useEffect(() => {
    const loadStripe = async () => {
      try {
        const Stripe = (window as any).Stripe;
        if (!Stripe) {
          const script = document.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          script.async = true;
          script.onload = () => initializeStripe();
          document.head.appendChild(script);
        } else {
          initializeStripe();
        }
      } catch (error) {
        console.error('Failed to load Stripe:', error);
        setError('Failed to load payment processor');
        setIsLoading(false);
      }
    };

    const initializeStripe = () => {
      try {
        const Stripe = (window as any).Stripe;
        const stripeInstance = Stripe(STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
        
        const elements = stripeInstance.elements();
        const card = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: 'Arial, sans-serif',
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
        
        card.mount('#card-element');
        card.on('change', (event: any) => {
          setError(event.error ? event.error.message : null);
        });
        
        setCardElement(card);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setError('Failed to initialize payment processor');
        setIsLoading(false);
      }
    };

    loadStripe();

    // Cleanup function
    return () => {
      if (cardElement) {
        cardElement.unmount();
      }
    };
  }, []);

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Call Supabase Edge Function to create payment intent
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            amount,
            currency,
            description,
          },
        });

        if (error) {
          throw error;
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, currency, description]);

  // Handle payment submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !cardElement || !clientSecret) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: email,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentIntent.id);
        }
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      if (onPaymentError) {
        onPaymentError(error);
      }
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your card details to complete the payment
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardholder-name">Cardholder Name</Label>
                <Input
                  id="cardholder-name"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-element">Card Details</Label>
                <div
                  id="card-element"
                  className="border rounded-md p-3 h-10 bg-white"
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              
              <div className="text-sm">
                <span className="font-medium">Amount:</span>{' '}
                {new Intl.NumberFormat('en-ZA', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(amount / 100)}
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isProcessing || !clientSecret}
          >
            {isProcessing ? 'Processing...' : buttonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StripePaymentForm;
