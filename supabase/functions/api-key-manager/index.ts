
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple encryption/decryption using Web Crypto API
async function encrypt(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const keyData = encoder.encode(key.padEnd(32, '0').substring(0, 32));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
}

async function decrypt(encryptedText: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key.padEnd(32, '0').substring(0, 32));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  
  const data = new Uint8Array([...atob(encryptedText)].map(char => char.charCodeAt(0)));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid token");
    }

    const { action, apiKey } = await req.json();
    const encryptionKey = Deno.env.get("API_ENCRYPTION_KEY") || "default-key-change-me";

    if (action === "save") {
      // Encrypt and save API key
      const encryptedKey = await encrypt(apiKey, encryptionKey + user.id);
      
      const { error } = await supabaseClient
        .from("user_api_keys")
        .upsert({
          user_id: user.id,
          service: "gemini",
          encrypted_key: encryptedKey,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (action === "retrieve") {
      // Retrieve and decrypt API key
      const { data, error } = await supabaseClient
        .from("user_api_keys")
        .select("encrypted_key")
        .eq("user_id", user.id)
        .eq("service", "gemini")
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ apiKey: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const decryptedKey = await decrypt(data.encrypted_key, encryptionKey + user.id);
      
      return new Response(JSON.stringify({ apiKey: decryptedKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");

  } catch (error) {
    console.error("API key manager error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
