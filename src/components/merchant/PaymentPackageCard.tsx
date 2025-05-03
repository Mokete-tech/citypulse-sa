import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { PaymentDialog } from '@/components/payment/PaymentDialog';
import { formatAmountForDisplay } from '@/integrations/stripe/client';
import { toast } from 'sonner';

interface Feature {
  name: string;
  included: boolean;
}

interface PaymentPackageCardProps {
  title: string;
  description: string;
  price: number;
  features: Feature[];
  popular?: boolean;
  type: 'deal' | 'event';
  variant: 'standard' | 'premium';
  onPaymentSuccess?: (paymentId: string, packageType: string) => void;
}

export function PaymentPackageCard({
  title,
  description,
  price,
  features,
  popular = false,
  type,
  variant,
  onPaymentSuccess
}: PaymentPackageCardProps) {
  const handlePaymentSuccess = (paymentId: string) => {
    toast.success(`${title} package purchased successfully!`, {
      description: 'Your listing will be active shortly.'
    });
    
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentId, `${type}_${variant}`);
    }
  };

  return (
    <Card className={`w-full ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-primary hover:bg-primary/90">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <span className="text-2xl font-bold">
            {formatAmountForDisplay(price * 100)}
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check 
                className={`h-5 w-5 mr-2 ${feature.included ? 'text-primary' : 'text-gray-300'}`} 
              />
              <span className={feature.included ? '' : 'text-gray-400 line-through'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <PaymentDialog
          amount={price}
          description={`${title} - ${type.charAt(0).toUpperCase() + type.slice(1)} Package`}
          buttonText={`Purchase ${title}`}
          buttonVariant="default"
          onSuccess={handlePaymentSuccess}
          metadata={{
            package_type: type,
            package_variant: variant,
            package_name: title,
            package_price: price
          }}
        />
      </CardFooter>
    </Card>
  );
}
