import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentForm } from './PaymentForm';
import { useStripe } from '@/contexts/StripeContext';

interface PaymentDialogProps {
  amount: number;
  description: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onSuccess?: (paymentId: string) => void;
  metadata?: Record<string, any>;
  children?: React.ReactNode;
}

export function PaymentDialog({
  amount,
  description,
  buttonText = 'Pay Now',
  buttonVariant = 'default',
  onSuccess,
  metadata = {},
  children
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const { isConfigured } = useStripe();

  const handleSuccess = (paymentId: string) => {
    setOpen(false);
    if (onSuccess) {
      onSuccess(paymentId);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={buttonVariant}>
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Secure payment processed by Stripe
          </DialogDescription>
        </DialogHeader>
        <PaymentForm
          amount={amount}
          description={description}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          metadata={metadata}
        />
      </DialogContent>
    </Dialog>
  );
}
