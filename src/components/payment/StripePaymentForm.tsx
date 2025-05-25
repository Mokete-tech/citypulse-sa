import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  amount: number;
  itemType: 'deal' | 'event';
  itemId: number;
  itemName: string;
  isPremium: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PaymentError {
  code: string;
  message: string;
  type: 'validation' | 'payment' | 'network' | 'unknown';
}

// The inner form component that uses the Stripe hooks
function PaymentForm({
  amount,
  itemType,
  itemId,
  itemName,
  isPremium,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { createPaymentIntent, validatePayment } = useStripeContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create a payment intent when the component mounts
  useEffect(() => {
    const initializePayment = async () => {
      if (!user) {
        setError({
          code: 'auth_required',
          message: 'You must be logged in to make a payment',
          type: 'validation'
        });
        return;
      }

      // Validate payment amount
      const validation = validatePayment(amount, 'ZAR');
      if (!validation.isValid) {
        setError({
          code: 'invalid_amount',
          message: validation.error || 'Invalid payment amount',
          type: 'validation'
        });
        return;
      }

      try {
        const { clientSecret, error } = await createPaymentIntent(amount, {
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          item_name: itemName,
          premium: isPremium
        });

        if (error || !clientSecret) {
          throw new Error(error || 'Failed to initialize payment');
        }

        setClientSecret(clientSecret);
      } catch (err: any) {
        console.error('Payment initialization error:', err);
        setError({
          code: 'init_failed',
          message: err.message || 'Failed to initialize payment',
          type: 'payment'
        });
        toast.error('Payment initialization failed', {
          description: err.message || 'Failed to initialize payment'
        });
      }
    };

    initializePayment();
  }, [user, amount, itemType, itemId, itemName, isPremium, createPaymentIntent, validatePayment]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError({
        code: 'stripe_not_loaded',
        message: 'Payment system is not ready. Please try again.',
        type: 'payment'
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Handle different payment methods
      if (paymentMethod === 'card') {
        // Process card payment with Stripe
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user?.email || '',
            },
          },
        });

        if (stripeError) {
          throw stripeError;
        }

        if (paymentIntent.status === 'succeeded') {
          // Record the payment in Supabase
          const { error: dbError } = await supabase.from('transactions').insert({
            payment_intent_id: paymentIntent.id,
            amount: amount,
            currency: 'ZAR',
            status: 'succeeded',
            type: 'payment',
            description: `Payment for ${itemType}: ${itemName}`,
            metadata: {
              user_id: user?.id,
              item_type: itemType,
              item_id: itemId,
              item_name: itemName,
              premium: isPremium
            }
          });

          if (dbError) {
            console.error('Error recording payment:', dbError);
            throw new Error('Failed to record payment in database');
          }

          setPaymentStatus('success');
          toast.success('Payment successful!', {
            description: `Your payment of R${amount.toFixed(2)} has been processed successfully.`
          });

          // Call the success callback
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        // Handle alternative payment methods
        // For now, we'll simulate a successful payment for demo purposes
        
        // In a real implementation, you would:
        // 1. Redirect to the appropriate payment gateway
        // 2. Handle the callback from the payment gateway
        // 3. Record the payment in your database
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Record the payment in Supabase
        const { error: dbError } = await supabase.from('payments').insert({
          user_id: user?.id,
          merchant_id: 'merchant_id', // Replace with actual merchant ID
          amount: amount,
          currency: 'ZAR',
          payment_method: paymentMethod,
          status: 'succeeded',
          item_type: itemType,
          item_id: itemId,
          item_name: itemName,
          premium: isPremium,
          payment_intent_id: `demo_${Date.now()}`
        });

        if (dbError) {
          console.error('Error recording payment:', dbError);
        }

        setPaymentStatus('success');
        toast.success('Payment successful!', {
          description: `Your payment of R${amount.toFixed(2)} has been processed successfully.`
        });

        // Call the success callback
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError({
        code: err.code || 'payment_failed',
        message: err.message || 'Payment failed. Please try again.',
        type: err.type || 'payment'
      });
      setPaymentStatus('error');
      toast.error('Payment failed', {
        description: err.message || 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Render different content based on payment status
  const renderContent = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-center text-muted-foreground mb-4">
              Your payment of R{amount.toFixed(2)} has been processed successfully.
            </p>
            <Button onClick={onSuccess}>Continue</Button>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
            <p className="text-center text-muted-foreground mb-4">
              {error?.message || 'An error occurred during payment processing'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={() => setPaymentStatus('idle')}>Try Again</Button>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              disabled={isProcessing}
            />
            
            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Details</label>
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
            )}
            
            {paymentMethod === 'eft' && (
              <div className="border rounded-md p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Bank Transfer Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please use the following details to make your bank transfer:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Bank:</span>
                    <span>First National Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account Name:</span>
                    <span>CityPulse South Africa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account Number:</span>
                    <span>62123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Branch Code:</span>
                    <span>250655</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reference:</span>
                    <span>CP-{itemType.toUpperCase()}-{itemId}</span>
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'mobile' && (
              <div className="border rounded-md p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Mobile Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan the QR code with your SnapScan or Zapper app:
                </p>
                <div className="flex justify-center mb-4">
                  <div className="border p-4 inline-block">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-sm text-gray-500">QR Code Placeholder</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Or use the code: <span className="font-medium">CP-{itemId}</span>
                </p>
              </div>
            )}
            
            {paymentMethod === 'instant' && (
              <div className="border rounded-md p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Instant EFT</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You'll be redirected to your bank's website to complete the payment.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="border rounded p-2 w-24 h-12 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium">FNB</span>
                  </div>
                  <div className="border rounded p-2 w-24 h-12 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium">ABSA</span>
                  </div>
                  <div className="border rounded p-2 w-24 h-12 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium">Nedbank</span>
                  </div>
                  <div className="border rounded p-2 w-24 h-12 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium">Standard Bank</span>
                  </div>
                  <div className="border rounded p-2 w-24 h-12 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium">Capitec</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>R{amount.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isProcessing} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isProcessing || (paymentMethod === 'card' && (!stripe || !elements))} 
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay R${amount.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          disabled={isProcessing}
        />

        {paymentMethod === 'card' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Details</label>
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
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error.message}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-500">
          Total: <span className="font-medium text-gray-900">R{amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing || paymentStatus === 'success'}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Paid
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// The wrapper component that provides the Stripe context
export function StripePaymentForm(props: PaymentFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment for {props.itemType === 'deal' ? 'Deal' : 'Event'}: {props.itemName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <PaymentForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  );
}
