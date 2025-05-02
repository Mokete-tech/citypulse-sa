// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const MAILERSEND_API_KEY = Deno.env.get("MAILERSEND_API_KEY") || "";
const MAILERSEND_FROM_EMAIL = Deno.env.get("MAILERSEND_FROM_EMAIL") || "noreply@citypulse-sa.com";
const MAILERSEND_FROM_NAME = Deno.env.get("MAILERSEND_FROM_NAME") || "CityPulse South Africa";
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
    const { 
      to, 
      subject, 
      html, 
      text, 
      templateId, 
      variables, 
      attachments, 
      tags 
    } = await req.json();

    // Validate required parameters
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters (to, subject)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate MailerSend API key
    if (!MAILERSEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "MailerSend API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format recipients
    const recipients = Array.isArray(to) 
      ? to.map(recipient => {
          if (typeof recipient === 'string') {
            return { email: recipient };
          }
          return recipient;
        }) 
      : [{ email: to }];

    // Prepare the email payload
    const emailPayload: any = {
      from: {
        email: MAILERSEND_FROM_EMAIL,
        name: MAILERSEND_FROM_NAME
      },
      to: recipients,
      subject: subject,
      tags: tags || []
    };

    // Add content based on what's provided
    if (templateId) {
      emailPayload.template_id = templateId;
      if (variables) {
        emailPayload.variables = recipients.map(recipient => ({
          email: recipient.email,
          substitutions: Object.entries(variables).map(([key, value]) => ({
            var: key,
            value: value
          }))
        }));
      }
    } else {
      if (html) {
        emailPayload.html = html;
      }
      if (text) {
        emailPayload.text = text;
      }
    }

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    // Send the email via MailerSend API
    const mailersendResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await mailersendResponse.json();

    // Log the email in the database
    await supabase.from("email_logs").insert({
      user_id: user.id,
      recipient: typeof to === 'string' ? to : recipients.map(r => r.email).join(','),
      subject: subject,
      template_id: templateId || null,
      status: mailersendResponse.ok ? "sent" : "failed",
      service: "mailersend",
      error: !mailersendResponse.ok ? JSON.stringify(responseData) : null
    });

    if (!mailersendResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email", 
          details: responseData 
        }),
        {
          status: mailersendResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.id || responseData.message_id
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
