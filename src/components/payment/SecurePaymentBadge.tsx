import { Shield, Lock, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SecurePaymentBadgeProps {
  variant?: "inline" | "card";
  showDetails?: boolean;
  className?: string;
}

/**
 * Badge showing secure payment information to build trust
 */
const SecurePaymentBadge = ({
  variant = "inline",
  showDetails = false,
  className = "",
}: SecurePaymentBadgeProps) => {
  if (variant === "inline") {
    return (
      <div className={`flex items-center text-sm text-muted-foreground ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1 text-green-600" />
                <span>Secure Payment</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <Card className={`border-green-100 bg-green-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Shield className="h-8 w-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">Secure Payment Processing</h3>
            {showDetails && (
              <div className="mt-2 space-y-2 text-sm text-green-700">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>PCI DSS compliant</span>
                </div>
                <p className="mt-2 text-xs">
                  We use Stripe for secure payment processing. Your payment information is encrypted and never stored on our servers.
                  All transactions are protected with industry-standard security measures.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurePaymentBadge;
