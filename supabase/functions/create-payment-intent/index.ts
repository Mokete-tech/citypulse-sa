// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

// Get environment variables
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Validate environment variables
if (!STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
}

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY || ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    // Check if Stripe is configured
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Stripe is not configured. Missing STRIPE_SECRET_KEY.");
    }

    // Check if Supabase is configured
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase is not configured. Missing environment variables.");
    }

    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      throw new Error("Invalid JSON in request body");
    }

    const { amount, currency = "zar", metadata = {} } = requestData;

    // Validate required parameters
    if (!amount) {
      throw new Error("Missing required parameter: amount");
    }

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error("Invalid amount: must be a positive number");
    }

    // Create a payment intent with Stripe
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in cents
        currency: currency.toLowerCase(),
        metadata,
        payment_method_types: ["card"],
      });
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      throw new Error(`Stripe error: ${stripeError.message || "Unknown Stripe error"}`);
    }

    // Store the payment intent in Supabase for tracking
    try {
      const { error: dbError } = await supabase.from("payment_intents").insert({
        payment_intent_id: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status,
        metadata,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Error storing payment intent:", dbError);
        // Continue anyway, as this is just for tracking
      }
    } catch (dbError) {
      console.error("Database error when storing payment intent:", dbError);
      // Continue anyway, as this is just for tracking
    }

    // Return the client secret to the client
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Determine appropriate status code based on error
    let statusCode = 400;
    if (error.message?.includes("not configured")) {
      statusCode = 500; // Server configuration error
    } else if (error.message?.includes("Invalid JSON")) {
      statusCode = 400; // Bad request
    } else if (error.message?.includes("Stripe error")) {
      statusCode = 502; // Bad gateway (upstream service error)
    }

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create payment intent",
        success: false,
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
});
