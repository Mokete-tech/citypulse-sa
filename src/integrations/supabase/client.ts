
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded Supabase credentials for production
const SUPABASE_URL = 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTU4NjUsImV4cCI6MjA2MDIzMTg2NX0.QInil2Wr7x14JwpRKKkIcgG6WwyOIUFx-O_kL8o2jdg';

// Log the Supabase credentials for debugging
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Anon Key:', SUPABASE_ANON_KEY ? 'Key is set' : 'Key is not set');

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
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
    // Check if credentials are set
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Cannot connect to Supabase: Missing credentials');

      return {
        success: false,
        error: 'Missing Supabase credentials',
        details: { url: !!SUPABASE_URL, key: !!SUPABASE_ANON_KEY }
      };
    }

    // Try to query a table that we know exists (deals)
    const { data, error } = await supabase.from('deals').select('id').limit(1);

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
