import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Landmark, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { PaymentDialog } from './PaymentDialog';

interface PaymentMethodSelectorProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string, method: string) => void;
  onCancel?: () => void;
  className?: string;
}

type PaymentMethod = 'card' | 'ewallet' | 'bank' | 'other';

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  description,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value as PaymentMethod);
  };

  const handleContinue = () => {
    if (selectedMethod === 'card') {
      setShowPaymentForm(true);
    } else {
      // For other payment methods, we would redirect to the appropriate provider
      // For now, we'll just simulate a successful payment
      simulateAlternativePayment();
    }
  };

  const simulateAlternativePayment = () => {
    toast.info('Redirecting to payment provider...', {
      description: `You'll be redirected to complete your ${getMethodName(selectedMethod)} payment.`
    });

    // Simulate a delay and then success
    setTimeout(() => {
      const fakePaymentId = `pi_${Math.random().toString(36).substring(2)}`;
      
      toast.success('Payment successful!', {
        description: `Your payment of R${amount.toFixed(2)} has been processed.`
      });
      
      if (onSuccess) {
        onSuccess(fakePaymentId, selectedMethod);
      }
    }, 2000);
  };

  const getMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'ewallet': return 'E-Wallet';
      case 'bank': return 'Bank Transfer';
      case 'other': return 'Other';
      default: return 'Unknown';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'ewallet': return <Wallet className="h-5 w-5" />;
      case 'bank': return <Landmark className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    if (onSuccess) {
      onSuccess(paymentId, 'card');
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
          
          <RadioGroup 
            value={selectedMethod} 
            onValueChange={handleMethodChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                <span>Credit/Debit Card</span>
              </Label>
              <div className="flex space-x-1">
                <img src="/images/visa.svg" alt="Visa" className="h-6" />
                <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="ewallet" id="ewallet" />
              <Label htmlFor="ewallet" className="flex items-center cursor-pointer flex-1">
                <Wallet className="h-5 w-5 mr-2 text-green-600" />
                <span>E-Wallet</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center cursor-pointer flex-1">
                <Landmark className="h-5 w-5 mr-2 text-purple-600" />
                <span>Bank Transfer</span>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleContinue} className="gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Dialog for card payments */}
      {showPaymentForm && (
        <PaymentDialog
          amount={amount}
          description={description}
          onSuccess={handlePaymentSuccess}
          buttonText="Pay Now"
        >
          <Button onClick={() => setShowPaymentForm(true)} className="w-full">
            Pay with Card
          </Button>
        </PaymentDialog>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
