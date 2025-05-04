
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials
// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility with Vercel integration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Missing Supabase environment variables. Please check that either VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

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

      console.error('Cannot connect to Supabase: Missing environment variables');
      console.info('Available environment variables:', envVars);

      return {
        success: false,
        error: 'Missing Supabase environment variables',
        details: envVars
      };
    }

    // Try to query a table to verify connection
    const { data, error } = await supabase.from('health_check').select('*').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return {
        success: false,
        error: error.message || 'Database connection error',
        details: error
      };
    }

    console.info('Successfully connected to Supabase');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to connect to Supabase:', error);
    return {
      success: false,
      error: error.message || 'Unexpected error connecting to Supabase',
      details: error
    };
  }
};
