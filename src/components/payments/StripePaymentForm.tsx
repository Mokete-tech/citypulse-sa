import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';

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
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would use Stripe.js to securely collect card details
      // and create a payment intent on your server. This is a simplified mock implementation.
      
      // Generate a mock payment ID
      const paymentId = `stripe_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
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
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: 'There was an error processing your payment. Please try again.'
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
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength={19}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                maxLength={3}
              />
            </div>
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
