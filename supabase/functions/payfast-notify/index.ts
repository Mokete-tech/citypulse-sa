
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const payment_status = formData.get("payment_status");
    const m_payment_id = formData.get("m_payment_id");
    const pf_payment_id = formData.get("pf_payment_id");
    const amount_gross = formData.get("amount_gross");
    const custom_str1 = formData.get("custom_str1"); // businessId
    const custom_str2 = formData.get("custom_str2"); // packageType

    console.log("PayFast notification received:", {
      payment_status,
      m_payment_id,
      pf_payment_id,
      amount_gross,
      custom_str1,
      custom_str2
    });

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (payment_status === "COMPLETE") {
      // Payment successful - activate package
      const { error } = await supabaseClient
        .from("business_packages")
        .upsert({
          business_id: custom_str1,
          package_type: custom_str2,
          amount: parseFloat(amount_gross as string),
          payment_id: pf_payment_id,
          status: "active",
          activated_at: new Date().toISOString(),
          expires_at: custom_str2?.includes("week") 
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            : null // For event packages, set expiry based on event date
        });

      if (error) {
        console.error("Error updating package status:", error);
      } else {
        console.log("Package activated successfully");
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("PayFast notification error:", error);
    return new Response("Error", { status: 500 });
  }
});
