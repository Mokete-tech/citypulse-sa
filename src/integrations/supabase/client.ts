
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variable configuration
const ENV_CONFIG = {
  // Default Supabase project for this application
  DEFAULT_SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
  // Placeholder for API key - will be replaced by environment variables
  DEFAULT_SUPABASE_ANON_KEY: ''
};

// Get environment variables (support both VITE_ and NEXT_PUBLIC_ prefixes)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ||
                     import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
                     ENV_CONFIG.DEFAULT_SUPABASE_URL;

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                          import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                          ENV_CONFIG.DEFAULT_SUPABASE_ANON_KEY;

const IS_DEV = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Determine if we're using default values
const usingDefaults = (
  SUPABASE_URL === ENV_CONFIG.DEFAULT_SUPABASE_URL &&
  SUPABASE_ANON_KEY === ENV_CONFIG.DEFAULT_SUPABASE_ANON_KEY
);

// Log configuration in development mode
if (IS_DEV) {
  console.log('Environment:', import.meta.env.MODE || 'development');
  console.log('Supabase URL:', SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'Not set');
  console.log('Supabase Anon Key:', SUPABASE_ANON_KEY ? 'Key is set' : 'Not set');

  if (usingDefaults) {
    console.warn(
      '⚠️ Using default Supabase configuration. ' +
      'This is fine for development, but you should set up your own project for production.'
    );
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the Supabase client with error handling
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storageKey: 'citypulse_auth_token',
    },
    global: {
      headers: {
        'X-Disable-Error-UI': 'true', // Disable the built-in error UI
        'X-Client-Info': 'citypulse-south-africa-insight'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Export a flag indicating if we're using default credentials
export const isUsingDefaultCredentials = usingDefaults;

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    // Check environment variables
    const envVars = {
      VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      USING_DEFAULTS: usingDefaults
    };

    if (IS_DEV) {
      console.info('Checking Supabase connection with environment:', envVars);
    }

    // Try to query the deals table to verify connection
    const { data: timeData, error: timeError } = await supabase.from('deals').select('created_at').limit(1);

    if (timeError) {
      if (IS_DEV) {
        console.error('Supabase deals table check failed:', timeError);
      }

      // Try to query another table as a fallback
      const { error } = await supabase.from('events').select('id').limit(1);

      if (error) {
        if (IS_DEV) {
          console.error('Supabase deals table check failed:', error);
        }

        // Try a different table as a fallback
        const { error: eventsError } = await supabase.from('events').select('id').limit(1);

        if (eventsError) {
          // All attempts failed
          return {
            success: false,
            error: 'Database connection error: Could not connect to any tables',
            details: {
              timeError,
              dealsError: error,
              eventsError,
              usingDefaults
            }
          };
        }
      }
    }

    // If we got here, at least one of the checks succeeded
    if (IS_DEV) {
      console.info('Successfully connected to Supabase');
      if (timeData) {
        console.info('Supabase server time:', timeData);
      }
    }

    return {
      success: true,
      details: {
        serverTime: timeData,
        usingDefaults
      }
    };
  } catch (error: any) {
    if (IS_DEV) {
      console.error('Failed to connect to Supabase:', error);
    }

    return {
      success: false,
      error: error.message || 'Unexpected error connecting to Supabase',
      details: {
        error,
        usingDefaults
      }
    };
  }
};
