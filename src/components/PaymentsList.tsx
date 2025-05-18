import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

export function PaymentsList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("payments").select("*").then(({ data }) => {
      setPayments(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h2>All Payments</h2>
      <ul>
        {payments.map((pay) => (
          <li key={pay.id}>
            <b>{pay.amount}</b> ZAR for <i>{pay.item_name}</i> - Status: {pay.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
