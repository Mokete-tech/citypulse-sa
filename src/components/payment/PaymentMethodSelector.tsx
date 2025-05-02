import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Smartphone, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'card' | 'eft' | 'mobile' | 'instant';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  className
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onSelect(value as PaymentMethod)}
        className="space-y-3"
      >
        <div className={cn(
          "flex items-center space-x-3 p-3 border rounded-md transition-all duration-200",
          selectedMethod === 'card' 
            ? "border-primary/50 bg-primary/5 shadow-sm" 
            : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Credit/Debit Card</span>
              <p className="text-sm text-muted-foreground">Pay securely with your card</p>
            </div>
          </Label>
        </div>
        
        <div className={cn(
          "flex items-center space-x-3 p-3 border rounded-md transition-all duration-200",
          selectedMethod === 'eft' 
            ? "border-primary/50 bg-primary/5 shadow-sm" 
            : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="eft" id="eft" />
          <Label htmlFor="eft" className="flex items-center gap-2 cursor-pointer">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">EFT/Bank Transfer</span>
              <p className="text-sm text-muted-foreground">Pay via bank transfer</p>
            </div>
          </Label>
        </div>
        
        <div className={cn(
          "flex items-center space-x-3 p-3 border rounded-md transition-all duration-200",
          selectedMethod === 'mobile' 
            ? "border-primary/50 bg-primary/5 shadow-sm" 
            : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="mobile" id="mobile" />
          <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
            <Smartphone className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Mobile Payment</span>
              <p className="text-sm text-muted-foreground">Pay with SnapScan or Zapper</p>
            </div>
          </Label>
        </div>
        
        <div className={cn(
          "flex items-center space-x-3 p-3 border rounded-md transition-all duration-200",
          selectedMethod === 'instant' 
            ? "border-primary/50 bg-primary/5 shadow-sm" 
            : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="instant" id="instant" />
          <Label htmlFor="instant" className="flex items-center gap-2 cursor-pointer">
            <Landmark className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Instant EFT</span>
              <p className="text-sm text-muted-foreground">Pay instantly from your bank account</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
