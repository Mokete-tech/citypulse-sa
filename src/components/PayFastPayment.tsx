
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PayFastPaymentProps {
  packageType: string;
  amount: number;
  businessId: string;
  onPaymentStart?: () => void;
}

const PayFastPayment = ({ packageType, amount, businessId, onPaymentStart }: PayFastPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    onPaymentStart?.();

    try {
      const { data, error } = await supabase.functions.invoke('payfast-payment', {
        body: {
          packageType,
          amount,
          businessId
        }
      });

      if (error) throw error;

      // Open PayFast in new window
      const paymentWindow = window.open('', '_blank');
      if (paymentWindow) {
        paymentWindow.document.write(data);
        paymentWindow.document.close();
      }

      toast({
        title: "Redirecting to PayFast",
        description: "Complete your payment in the new window.",
      });

    } catch (error) {
      toast({
        title: "Payment Error",
        description: (error as Error).message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={loading}
      className="w-full"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {loading ? "Processing..." : `Pay R${amount} with PayFast`}
    </Button>
  );
};

export default PayFastPayment;
