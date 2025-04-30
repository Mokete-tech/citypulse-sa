
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Development fallback values (only used if env vars are missing and in development mode)
const DEV_FALLBACK = {
  SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjQ4MDAsImV4cCI6MjAxNDM0MDgwMH0.fallback-key-for-development'
};

// Use environment variables for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const IS_DEV = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Validate environment variables and use fallbacks in development if needed
let supabaseUrl = SUPABASE_URL;
let supabaseAnonKey = SUPABASE_ANON_KEY;
let usingFallback = false;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (IS_DEV) {
    // In development, use fallback values
    supabaseUrl = supabaseUrl || DEV_FALLBACK.SUPABASE_URL;
    supabaseAnonKey = supabaseAnonKey || DEV_FALLBACK.SUPABASE_ANON_KEY;
    usingFallback = true;

    console.warn(
      '⚠️ Using development fallback for Supabase credentials. ' +
      'This is only for local development and testing. ' +
      'Please set up your .env file with actual credentials for production.'
    );
  } else {
    // In production, log a more severe error
    console.error(
      '🚨 CRITICAL ERROR: Missing Supabase environment variables in production environment. ' +
      'The application will not function correctly without these variables. ' +
      'Please check your environment configuration and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Export a flag indicating if we're using fallback credentials
export const isUsingFallbackCredentials = usingFallback;
