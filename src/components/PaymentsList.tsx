
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  item_name: string;
  status: string;
  created_at: string;
}

export function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let { data, error } = await supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false });

        // Handle error from Supabase
        if (error) {
          throw error;
        }

        // Parse response
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          // If data is not an array, use fallback
          console.warn("Invalid payment data format", data);
          setPayments([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch payments:", err);
        setError(err.message || "Failed to load payments");
        toast.error("Could not load payments", { 
          description: "Please try again later" 
        });
        // Provide fallback data if needed
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">All Payments</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="py-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading payments...</span>
        </div>
      ) : payments.length > 0 ? (
        <ul className="divide-y">
          {payments.map((payment) => (
            <li key={payment.id} className="py-3">
              <span className="font-medium">R{payment.amount}</span> for{" "}
              <span className="italic">{payment.item_name}</span> - Status:{" "}
              <span className={`${
                payment.status === 'succeeded' ? 'text-green-600' : 
                payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {payment.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic py-4">No payment records found</p>
      )}
    </div>
  );
}
