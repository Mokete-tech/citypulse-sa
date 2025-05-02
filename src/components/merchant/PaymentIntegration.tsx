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
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'eft' | 'payfast'>('credit_card');
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
      // In a real app, this would call a secure payment processor
      // For demo purposes, we'll simulate a successful payment
      
      // Generate a transaction ID
      const newTransactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setTransactionId(newTransactionId);
      
      // Record the payment in Supabase
      const { error: paymentError } = await supabase.from('payments').insert({
        merchant_id: merchantId,
        item_id: itemId,
        item_type: itemType,
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: newTransactionId,
        status: 'completed'
      });
      
      if (paymentError) throw new Error(paymentError.message);
      
      // Update the item status based on type
      if (itemType === 'deal' || itemType === 'event') {
        const { error: itemError } = await supabase
          .from(itemType === 'deal' ? 'deals' : 'events')
          .update({ status: 'active', paid: true })
          .eq('id', itemId);
          
        if (itemError) throw new Error(itemError.message);
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
      await supabase.from('analytics').insert({
        event_type: 'payment_completed',
        event_source: 'payment_integration',
        source_id: itemId,
        metadata: {
          amount,
          item_type: itemType,
          payment_method: paymentMethod,
          merchant_id: merchantId
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
        description: `Your payment of R${amount.toFixed(2)} has been processed.`
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
          <Alert variant="success">
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
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex-1 cursor-pointer">Credit Card</Label>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="eft" id="eft" />
                <Label htmlFor="eft" className="flex-1 cursor-pointer">EFT (Bank Transfer)</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="payfast" id="payfast" />
                <Label htmlFor="payfast" className="flex-1 cursor-pointer">PayFast</Label>
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
          
          {paymentMethod === 'payfast' && (
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-700">
                You will be redirected to PayFast to complete your payment securely.
              </p>
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
