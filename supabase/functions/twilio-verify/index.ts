// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get("TWILIO_VERIFY_SERVICE_SID") || "";
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
    const { action, phoneNumber, code } = await req.json();

    // Validate required parameters
    if (!action || !phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Twilio credentials
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format the phone number to E.164 format if not already
    const formattedPhone = phoneNumber.startsWith("+") 
      ? phoneNumber 
      : `+${phoneNumber.replace(/\D/g, "")}`;

    // Create the Twilio API URL
    const twilioApiUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}`;
    
    // Handle different actions
    if (action === "send") {
      // Send verification code
      const verificationResponse = await fetch(`${twilioApiUrl}/Verifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
        },
        body: new URLSearchParams({
          "To": formattedPhone,
          "Channel": "sms"
        })
      });

      const verificationData = await verificationResponse.json();

      if (!verificationResponse.ok) {
        return new Response(
          JSON.stringify({ error: verificationData.message || "Failed to send verification code" }),
          {
            status: verificationResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Log the verification attempt
      await supabase.from("verification_logs").insert({
        user_id: user.id,
        phone_number: formattedPhone,
        action: "send",
        status: "success",
        service: "twilio"
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          verificationId: verificationData.sid,
          status: verificationData.status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (action === "check") {
      // Verify the code
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Verification code is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const verificationCheckResponse = await fetch(`${twilioApiUrl}/VerificationCheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
        },
        body: new URLSearchParams({
          "To": formattedPhone,
          "Code": code
        })
      });

      const verificationCheckData = await verificationCheckResponse.json();

      // Log the verification check
      await supabase.from("verification_logs").insert({
        user_id: user.id,
        phone_number: formattedPhone,
        action: "check",
        status: verificationCheckData.status,
        service: "twilio"
      });

      if (!verificationCheckResponse.ok) {
        return new Response(
          JSON.stringify({ 
            error: verificationCheckData.message || "Failed to verify code",
            valid: false
          }),
          {
            status: verificationCheckResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          valid: verificationCheckData.status === "approved",
          status: verificationCheckData.status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
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
