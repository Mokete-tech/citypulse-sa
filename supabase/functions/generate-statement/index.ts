// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { format } from "https://esm.sh/date-fns@2.30.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the JWT token from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { merchantId, startDate, endDate, statementType } = await req.json();

    // Validate required parameters
    if (!merchantId || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters (merchantId, startDate, endDate)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the user is authorized to access this merchant's data
    const { data: merchantData, error: merchantError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .eq("merchant_id", merchantId)
      .single();

    if (merchantError || !merchantData) {
      return new Response(
        JSON.stringify({ error: "You are not authorized to access this merchant's data" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get merchant details
    const { data: merchant, error: merchantDetailsError } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchantId)
      .single();

    if (merchantDetailsError || !merchant) {
      return new Response(
        JSON.stringify({ error: "Merchant not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get transactions for the date range
    const { data: transactions, error: transactionsError } = await supabase
      .from("payments")
      .select("*")
      .eq("merchant_id", merchantId)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false });

    if (transactionsError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch transactions" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get deals for the merchant
    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id, title")
      .eq("merchant_id", merchantId);

    if (dealsError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch deals" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a map of deal IDs to titles for easy lookup
    const dealMap = deals.reduce((map, deal) => {
      map[deal.id] = deal.title;
      return map;
    }, {});

    // Generate HTML for the statement
    const statementHtml = generateStatementHtml(
      merchant,
      transactions,
      dealMap,
      startDate,
      endDate,
      statementType
    );

    // Generate a unique filename for the statement
    const filename = `statement_${merchantId}_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.pdf`;

    // Store the HTML in a temporary file in Supabase Storage
    const { data: htmlData, error: htmlError } = await supabase.storage
      .from("statements")
      .upload(`temp/${filename}.html`, statementHtml, {
        contentType: "text/html",
        upsert: true
      });

    if (htmlError) {
      return new Response(
        JSON.stringify({ error: "Failed to store statement HTML" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Convert HTML to PDF using a third-party service or library
    // For this example, we'll just return a signed URL to the HTML file
    // In a real implementation, you would convert this to PDF
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from("statements")
      .createSignedUrl(`temp/${filename}.html`, 60 * 60 * 24); // 24 hours expiry

    if (signedUrlError) {
      return new Response(
        JSON.stringify({ error: "Failed to generate signed URL" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the statement generation
    await supabase.from("statement_logs").insert({
      merchant_id: merchantId,
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
      statement_type: statementType,
      filename: filename
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        statementUrl: signedUrl.signedUrl
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateStatementHtml(
  merchant,
  transactions,
  dealMap,
  startDate,
  endDate,
  statementType
) {
  const formattedStartDate = format(new Date(startDate), "MMMM d, yyyy");
  const formattedEndDate = format(new Date(endDate), "MMMM d, yyyy");
  
  // Calculate totals
  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalFees = transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0);
  const netAmount = totalAmount - totalFees;
  
  // Group transactions by month if summary type
  let monthlyTotals = {};
  if (statementType === 'summary') {
    transactions.forEach(tx => {
      const month = format(new Date(tx.created_at), "MMMM yyyy");
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { amount: 0, fees: 0, count: 0 };
      }
      monthlyTotals[month].amount += (tx.amount || 0);
      monthlyTotals[month].fees += (tx.fee || 0);
      monthlyTotals[month].count += 1;
    });
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Merchant Statement</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          background: linear-gradient(to right, #0EA5E9, #10B981);
          color: white;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .merchant-info {
          margin-bottom: 20px;
        }
        .statement-info {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
        }
        .summary {
          margin-top: 30px;
          padding: 15px;
          background-color: #f0f9ff;
          border-radius: 5px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CityPulse South Africa</h1>
        <h2>Merchant Statement</h2>
      </div>
      
      <div class="merchant-info">
        <h3>Merchant Information</h3>
        <p><strong>Name:</strong> ${merchant.name}</p>
        <p><strong>ID:</strong> ${merchant.id}</p>
        <p><strong>Email:</strong> ${merchant.email}</p>
        <p><strong>Phone:</strong> ${merchant.phone}</p>
      </div>
      
      <div class="statement-info">
        <h3>Statement Details</h3>
        <p><strong>Period:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
        <p><strong>Type:</strong> ${statementType === 'detailed' ? 'Detailed Statement' : 'Summary Statement'}</p>
        <p><strong>Generated On:</strong> ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
      </div>
      
      ${statementType === 'detailed' ? `
        <h3>Transaction Details</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Fees</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(tx => `
              <tr>
                <td>${format(new Date(tx.created_at), "MMM d, yyyy")}</td>
                <td>${tx.id}</td>
                <td>${tx.deal_id ? dealMap[tx.deal_id] || 'Unknown Deal' : tx.description || 'Transaction'}</td>
                <td>R ${(tx.amount || 0).toFixed(2)}</td>
                <td>R ${(tx.fee || 0).toFixed(2)}</td>
                <td>R ${((tx.amount || 0) - (tx.fee || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <h3>Monthly Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Transactions</th>
              <th>Total Amount</th>
              <th>Total Fees</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(monthlyTotals).map(([month, data]) => `
              <tr>
                <td>${month}</td>
                <td>${data.count}</td>
                <td>R ${data.amount.toFixed(2)}</td>
                <td>R ${data.fees.toFixed(2)}</td>
                <td>R ${(data.amount - data.fees).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
      
      <div class="summary">
        <h3>Statement Summary</h3>
        <p><strong>Total Transactions:</strong> ${transactions.length}</p>
        <p><strong>Total Amount:</strong> R ${totalAmount.toFixed(2)}</p>
        <p><strong>Total Fees:</strong> R ${totalFees.toFixed(2)}</p>
        <p><strong>Net Amount:</strong> R ${netAmount.toFixed(2)}</p>
      </div>
      
      <div class="footer">
        <p>This is an official statement from CityPulse South Africa.</p>
        <p>© ${new Date().getFullYear()} CityPulse South Africa. All rights reserved.</p>
        <p>If you have any questions, please contact us at support@citypulse-sa.com</p>
      </div>
    </body>
    </html>
  `;
}
