
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
    const { packageType, amount, businessId } = await req.json();
    
    // PayFast configuration
    const merchant_id = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchant_key = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE");
    
    if (!merchant_id || !merchant_key) {
      throw new Error("PayFast credentials not configured");
    }

    // Create payment data
    const payment_data = {
      merchant_id,
      merchant_key,
      return_url: `${req.headers.get("origin")}/business-portal?payment=success`,
      cancel_url: `${req.headers.get("origin")}/business-portal?payment=cancelled`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-notify`,
      name_first: "Business",
      name_last: "Owner",
      email_address: "business@example.com",
      m_payment_id: businessId,
      amount: amount.toFixed(2),
      item_name: packageType,
      item_description: `${packageType} Package`,
      custom_str1: businessId,
      custom_str2: packageType,
    };

    // Generate signature (simplified - in production use proper signing)
    const data_string = Object.entries(payment_data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    if (passphrase) {
      payment_data.passphrase = passphrase;
    }

    // Create form HTML for PayFast
    const form_html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to PayFast...</title>
      </head>
      <body>
        <form id="payfast_form" action="https://sandbox.payfast.co.za/eng/process" method="post">
          ${Object.entries(payment_data).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value}">`
          ).join('')}
        </form>
        <script>
          document.getElementById('payfast_form').submit();
        </script>
      </body>
      </html>
    `;

    return new Response(form_html, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/html"
      },
      status: 200,
    });

  } catch (error) {
    console.error("PayFast payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
