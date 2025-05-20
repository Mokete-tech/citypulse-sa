
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { PaymentDialog } from '@/components/payment/PaymentDialog';
import { useAuth } from '@/hooks/useAuth';
import ResponsiveImage from '@/components/ui/responsive-image';
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
  imageSrc?: string;
  onPaymentSuccess: (paymentId: string, packageType: string) => void;
}

export function PaymentPackageCard({
  title,
  description,
  price,
  features,
  popular = false,
  type,
  variant,
  imageSrc,
  onPaymentSuccess
}: PaymentPackageCardProps) {
  const { user } = useAuth();

  const handlePayment = (paymentId: string) => {
    onPaymentSuccess(paymentId, `${type}_${variant}`);
  };

  const handlePaymentClick = () => {
    if (!user) {
      toast.error('Please login to purchase a package', {
        description: 'You need to be logged in to purchase a merchant package',
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/merchant/login'
        }
      });
    }
  };

  const packageId = `${type}_${variant}`;

  return (
    <Card className={`overflow-hidden transition-all ${popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
      {popular && (
        <div className="bg-blue-500 py-1 px-3 text-center text-xs font-medium text-white">
          MOST POPULAR
        </div>
      )}
      
      {imageSrc && (
        <div className="h-44 overflow-hidden">
          <ResponsiveImage
            src={imageSrc}
            alt={`${title} package`}
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
      )}
      
      <CardHeader className={`${popular ? 'bg-blue-50' : ''}`}>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <span className="text-3xl font-bold">R{price}</span>
          <span className="text-gray-500 ml-1">once-off</span>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
              )}
              <span className={feature.included ? "" : "text-gray-400"}>{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-6 py-4">
        {user ? (
          <PaymentDialog
            amount={price}
            description={`${title} - ${description}`}
            buttonText="Purchase Package"
            onSuccess={handlePayment}
            metadata={{
              packageType: packageId,
              merchantId: user.id
            }}
          >
            <Button className="w-full" variant={popular ? "default" : "outline"}>
              Purchase Package
            </Button>
          </PaymentDialog>
        ) : (
          <Button 
            className="w-full" 
            variant={popular ? "default" : "outline"}
            onClick={handlePaymentClick}
          >
            Purchase Package
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
