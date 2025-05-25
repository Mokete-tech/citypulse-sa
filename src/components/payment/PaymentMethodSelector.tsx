import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'card';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
  className
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium">Payment Method</h3>
      
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as PaymentMethod)}
        className="space-y-3"
        disabled={disabled}
      >
        <div className={cn(
          "flex items-center space-x-3 p-3 border rounded-md transition-all duration-200",
          value === 'card' 
            ? "border-primary/50 bg-primary/5 shadow-sm" 
            : "hover:bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <RadioGroupItem value="card" id="card" disabled={disabled} />
          <Label htmlFor="card" className={cn(
            "flex items-center gap-2",
            !disabled && "cursor-pointer"
          )}>
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Credit/Debit Card</span>
              <p className="text-sm text-muted-foreground">Pay securely with your card</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
