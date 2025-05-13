
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Production and development fallback values
const FALLBACK = {
  SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTU4NjUsImV4cCI6MjA2MDIzMTg2NX0.QInil2Wr7x14JwpRKKkIcgG6WwyOIUFx-O_kL8o2jdg'
};

// Use environment variables for Supabase credentials (support both VITE_ and NEXT_PUBLIC_ prefixes)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IS_DEV = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Log environment variables for debugging (only in development)
if (IS_DEV) {
  console.log('Supabase URL:', SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : 'Not set');
  console.log('Supabase Anon Key:', SUPABASE_ANON_KEY ? 'Key is set' : 'Not set');
}

// Validate environment variables and use fallbacks if needed
let supabaseUrl = SUPABASE_URL;
let supabaseAnonKey = SUPABASE_ANON_KEY;
let usingFallback = false;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Use fallback values in both development and production
  supabaseUrl = FALLBACK.SUPABASE_URL;
  supabaseAnonKey = FALLBACK.SUPABASE_ANON_KEY;
  usingFallback = true;

  if (IS_DEV) {
    console.warn(
      '⚠️ Using fallback for Supabase credentials. ' +
      'This is only for development and testing. ' +
      'Please set up your .env file with actual credentials for production.'
    );
  } else {
    console.warn(
      '⚠️ Using fallback for Supabase credentials in production. ' +
      'This is not recommended for a production environment. ' +
      'Please set up your environment variables in Vercel.'
    );
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the Supabase client with error handling
export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        'X-Disable-Error-UI': 'true' // Disable the built-in error UI
      }
    }
  }
);

// Export a flag indicating if we're using fallback credentials
export const isUsingFallbackCredentials = usingFallback;

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    // First check if environment variables are set
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      const envVars = {
        VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_URL: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      };

      if (IS_DEV) {
        console.error('Cannot connect to Supabase: Missing environment variables');
        console.info('Available environment variables:', envVars);
      }

      // If we're using fallback credentials, we can still try to connect
      if (!usingFallback) {
        return {
          success: false,
          error: 'Missing Supabase environment variables',
          details: envVars
        };
      }
    }

    // Try to query a table to verify connection - use deals table since we know it exists
    const { data, error } = await supabase.from('deals').select('id').limit(1);

    if (error) {
      if (IS_DEV) {
        console.error('Supabase connection error:', error);
      }

      // Try a different table as a fallback
      const { error: authError } = await supabase.from('auth').select('id').limit(1);

      if (authError) {
        // Both attempts failed
        return {
          success: false,
          error: error.message || 'Database connection error',
          details: { primaryError: error, secondaryError: authError }
        };
      }
    }

    if (IS_DEV) {
      console.info('Successfully connected to Supabase');
    }
    return { success: true };
  } catch (error: any) {
    if (IS_DEV) {
      console.error('Failed to connect to Supabase:', error);
    }

    return {
      success: false,
      error: error.message || 'Unexpected error connecting to Supabase',
      details: error
    };
  }
};
