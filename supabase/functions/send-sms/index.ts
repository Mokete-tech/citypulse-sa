// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER") || "";
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
    const { to, message, templateId, variables } = await req.json();

    // Validate required parameters
    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters (to, message)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Twilio credentials
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format the phone number to E.164 format if not already
    const formattedTo = to.startsWith("+") ? to : `+${to.replace(/\D/g, "")}`;

    // Apply template variables if provided
    let finalMessage = message;
    if (templateId && variables) {
      // Get the template from the database
      const { data: templateData, error: templateError } = await supabase
        .from("sms_templates")
        .select("content")
        .eq("id", templateId)
        .single();

      if (templateError || !templateData) {
        return new Response(
          JSON.stringify({ error: "Template not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Replace variables in the template
      finalMessage = templateData.content;
      for (const [key, value] of Object.entries(variables)) {
        finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
    }

    // Send the SMS via Twilio API
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
        },
        body: new URLSearchParams({
          "To": formattedTo,
          "From": TWILIO_PHONE_NUMBER,
          "Body": finalMessage
        })
      }
    );

    const responseData = await twilioResponse.json();

    // Log the SMS in the database
    await supabase.from("sms_logs").insert({
      user_id: user.id,
      recipient: formattedTo,
      message: finalMessage,
      template_id: templateId || null,
      status: twilioResponse.ok ? "sent" : "failed",
      service: "twilio",
      error: !twilioResponse.ok ? JSON.stringify(responseData) : null
    });

    if (!twilioResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to send SMS", 
          details: responseData 
        }),
        {
          status: twilioResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.sid
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
