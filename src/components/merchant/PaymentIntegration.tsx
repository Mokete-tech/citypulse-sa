import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { mailerSendService } from '@/services/mailersend-service';
import { stripeService } from '@/services/stripe-service';

interface PaymentIntegrationProps {
  amount: number;
  itemId: string;
  itemType: 'deal' | 'event' | 'subscription';
  itemTitle: string;
  merchantId: string;
  merchantName: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function PaymentIntegration({
  amount,
  itemId,
  itemType,
  itemTitle,
  merchantId,
  merchantName,
  onSuccess,
  onCancel,
  className
}: PaymentIntegrationProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'eft' | 'payfast' | 'paypal' | 'apple_pay' | 'google_pay'>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }

    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 3-4 digits
    const cvc = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(cvc);
  };

  const validateForm = () => {
    if (paymentMethod === 'credit_card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number');
        return false;
      }

      if (!cardName) {
        setError('Please enter the name on card');
        return false;
      }

      if (!cardExpiry || cardExpiry.length < 5) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }

      if (!cardCvc || cardCvc.length < 3) {
        setError('Please enter a valid CVC code');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setError(null);

    try {
      let newTransactionId: string;

      if (paymentMethod === 'credit_card') {
        // For credit card payments, use Stripe
        const amountInCents = Math.round(amount * 100); // Convert to cents

        // Create a payment element container if it doesn't exist
        let cardElement = document.getElementById('card-element');
        if (!cardElement) {
          cardElement = document.createElement('div');
          cardElement.id = 'card-element';
          cardElement.style.display = 'none';
          document.body.appendChild(cardElement);
        }

        // Process payment with Stripe
        const result = await stripeService.processPayment(
          amountInCents,
          itemId,
          itemType,
          `Payment for ${itemTitle}`
        );

        if (!result.success) {
          throw new Error(result.error || 'Payment failed');
        }

        newTransactionId = result.paymentIntentId || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      } else if (paymentMethod === 'payfast' || paymentMethod === 'paypal' || paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
        // For demo purposes, we'll simulate a successful payment
        // In production, this would redirect to the appropriate payment provider

        // Generate a transaction ID based on the payment method
        const prefix =
          paymentMethod === 'payfast' ? 'PF' :
          paymentMethod === 'paypal' ? 'PP' :
          paymentMethod === 'apple_pay' ? 'AP' : 'GP';

        newTransactionId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Log that we're simulating the payment
        console.log(`Simulating ${paymentMethod} payment with transaction ID:`, newTransactionId);

        // Simulate a delay to make it feel more realistic
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // For EFT, we'll generate a reference number
        newTransactionId = `EFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      setTransactionId(newTransactionId);

      // Record the payment in Supabase
      // In a real implementation, we would use proper database schema
      // For now, we'll simulate a successful payment record
      console.log('Recording payment:', {
        merchant_id: merchantId,
        item_id: itemId,
        item_type: itemType,
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: newTransactionId,
        status: paymentMethod === 'eft' ? 'pending' : 'completed'
      });

      // Simulate updating the item status
      if (itemType === 'deal' || itemType === 'event') {
        console.log('Updating item status:', {
          item_id: parseInt(itemId, 10),
          item_type: itemType,
          status: paymentMethod === 'eft' ? 'pending_verification' : 'active',
          paid: paymentMethod !== 'eft'
        });
      }

      // Send receipt email
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email) {
        await mailerSendService.sendMerchantReceiptEmail(
          userData.user.email,
          merchantName,
          itemTitle,
          `R ${amount.toFixed(2)}`,
          newTransactionId
        );
      }

      // Log analytics
      // In a real implementation, we would use proper analytics tracking
      console.log('Logging analytics event:', {
        event_type: 'payment_completed',
        event_source: 'payment_integration',
        source_id: itemId,
        metadata: {
          amount,
          item_type: itemType,
          payment_method: paymentMethod,
          merchant_id: merchantId,
          transaction_id: newTransactionId
        }
      });

      setIsSuccess(true);

      // Notify parent component
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(newTransactionId);
        }, 2000);
      }

      toast.success('Payment successful!', {
        description: paymentMethod === 'eft'
          ? 'Your EFT payment has been recorded. Your listing will be activated once payment is verified.'
          : `Your payment of R${amount.toFixed(2)} has been processed.`
      });

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment');

      toast.error('Payment failed', {
        description: 'There was a problem processing your payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Payment Successful
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Transaction Complete</AlertTitle>
            <AlertDescription>
              Your payment of R{amount.toFixed(2)} for {itemTitle} has been processed successfully.
              Transaction ID: {transactionId}
            </AlertDescription>
          </Alert>

          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Payment details</h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Amount: R{amount.toFixed(2)}</li>
                    <li>Payment method: {paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'eft' ? 'EFT' : 'PayFast'}</li>
                    <li>Transaction ID: {transactionId}</li>
                    <li>Date: {new Date().toLocaleDateString()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Secure payment for {itemTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="text-lg font-medium">Payment Summary</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item:</span>
              <span>{itemTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{itemType}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>R {amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as any)}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex-1 cursor-pointer">Credit Card</Label>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                <div className="h-5 w-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#0070BA">
                    <path d="M20.9,8.3c0,2.7-1.2,4.8-3.5,6.3c-2.3,1.5-5.4,2.3-9.2,2.3h-1l-0.6,4.2h-2L7.5,5.9h5.9c2.4,0,4.2,0.5,5.4,1.4 C20,8.2,20.9,9.7,20.9,8.3z M18.2,8.5c0-0.9-0.4-1.6-1.1-2.1c-0.7-0.5-1.8-0.7-3.3-0.7h-3.7l-1.1,7.9h3.1c1.9,0,3.4-0.4,4.4-1.1 C17.6,11.8,18.2,10.4,18.2,8.5z"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="apple_pay" id="apple_pay" />
                <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">Apple Pay</Label>
                <div className="h-5 w-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M17.6,12.9c-0.1-1.2,0.5-2.4,1.4-3.1c-0.7-1-1.9-1.6-3.1-1.7c-1.3-0.1-2.6,0.8-3.2,0.8c-0.7,0-1.7-0.8-2.8-0.8 c-1.5,0-2.8,0.9-3.6,2.2c-1.5,2.6-0.4,6.5,1.1,8.6c0.7,1.1,1.6,2.2,2.7,2.2c1.1,0,1.5-0.7,2.8-0.7c1.3,0,1.7,0.7,2.8,0.7 c1.2,0,1.9-1.1,2.6-2.1c0.5-0.8,0.9-1.6,1.2-2.5C18.5,15.4,17.7,14.2,17.6,12.9z M15.4,7.2c0.7-0.8,1-1.9,0.9-3 c-1,0.1-1.9,0.5-2.6,1.2c-0.7,0.7-1,1.7-0.9,2.7C13.8,8.2,14.7,7.8,15.4,7.2z"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="google_pay" id="google_pay" />
                <Label htmlFor="google_pay" className="flex-1 cursor-pointer">Google Pay</Label>
                <div className="h-5 w-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,19c-3.87,0-7-3.13-7-7 c0-3.87,3.13-7,7-7s7,3.13,7,7C19,15.87,15.87,19,12,19z" fill="#4285F4"/>
                    <path d="M15,9h-2v2h2c0.55,0,1,0.45,1,1s-0.45,1-1,1h-2v2h2c1.65,0,3-1.35,3-3S16.65,9,15,9z" fill="#34A853"/>
                    <path d="M9,9H7v6h2c1.65,0,3-1.35,3-3S10.65,9,9,9z M9,13H9v-2h0c0.55,0,1,0.45,1,1S9.55,13,9,13z" fill="#FBBC05"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="eft" id="eft" />
                <Label htmlFor="eft" className="flex-1 cursor-pointer">EFT (Bank Transfer)</Label>
                <svg viewBox="0 0 24 24" width="20" height="20" className="text-gray-600">
                  <path d="M4,10h16V4H4V10z M6,6h12v2H6V6z M4,20h16v-6H4V20z M6,16h12v2H6V16z" fill="currentColor"/>
                </svg>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="payfast" id="payfast" />
                <Label htmlFor="payfast" className="flex-1 cursor-pointer">PayFast</Label>
                <div className="h-5 w-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13.41,18.09V20h-2.67v-1.93 c-1.01-0.16-1.96-0.55-2.69-1.12l1.4-2.27c0.65,0.44,1.46,0.75,2.37,0.75c0.7,0,1.18-0.32,1.18-0.86c0-0.54-0.44-0.86-1.45-1.23 c-1.67-0.59-3.38-1.4-3.38-3.67c0-1.72,1.23-3.13,3.57-3.51V4h2.67v2.11c1.13,0.16,1.88,0.59,2.37,1.07L15.17,9.4 c-0.54-0.32-1.23-0.59-2-0.59c-0.86,0-1.13,0.38-1.13,0.81c0,0.48,0.49,0.75,1.67,1.18c1.88,0.65,3.19,1.56,3.19,3.73 C16.9,16.29,15.5,17.8,13.41,18.09z" fill="#EF4056"/>
                  </svg>
                </div>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'credit_card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="J. Smith"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={handleCvcChange}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'eft' && (
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Bank Transfer Details</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please use the following details to make your payment:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Bank: First National Bank</li>
                      <li>Account Name: CityPulse South Africa</li>
                      <li>Account Number: 62123456789</li>
                      <li>Branch Code: 250655</li>
                      <li>Reference: {itemId}</li>
                    </ul>
                    <p className="mt-2">After making the payment, click "Confirm Payment" below.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(paymentMethod === 'payfast' || paymentMethod === 'paypal' || paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-700">
                You will be redirected to complete your payment securely using {
                  paymentMethod === 'payfast' ? 'PayFast' :
                  paymentMethod === 'paypal' ? 'PayPal' :
                  paymentMethod === 'apple_pay' ? 'Apple Pay' :
                  'Google Pay'
                }.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                {paymentMethod === 'payfast' && 'PayFast provides a secure payment environment and supports all major South African banks.'}
                {paymentMethod === 'paypal' && 'PayPal provides a secure payment environment with buyer protection.'}
                {paymentMethod === 'apple_pay' && 'Apple Pay is a secure and private way to pay using your Apple devices.'}
                {paymentMethod === 'google_pay' && 'Google Pay is a fast, simple way to pay with Google.'}
              </p>

              <div className="mt-4 flex justify-center">
                {paymentMethod === 'payfast' && (
                  <img src="https://www.payfast.co.za/assets/images/logos/payfast-logo.svg" alt="PayFast" className="h-8" />
                )}
                {paymentMethod === 'paypal' && (
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-8" />
                )}
                {paymentMethod === 'apple_pay' && (
                  <img src="https://developer.apple.com/apple-pay/marketing/images/apple-pay-mark.svg" alt="Apple Pay" className="h-8" />
                )}
                {paymentMethod === 'google_pay' && (
                  <img src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png" alt="Google Pay" className="h-8" />
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay R{amount.toFixed(2)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
