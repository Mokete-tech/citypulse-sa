import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { fallbackDeals, fallbackEvents } from '@/data/fallback-data';

// Environment variable configuration
const ENV_CONFIG = {
  // Default Supabase project URL - this is just the project URL, not a secret
  DEFAULT_SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
};

// Use environment variables for Supabase credentials (support both VITE_ and NEXT_PUBLIC_ prefixes)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IS_DEV = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Use environment variables or default URL, but don't use a hardcoded key
const supabaseUrl = SUPABASE_URL || ENV_CONFIG.DEFAULT_SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY || '';

// Log warning in development mode if missing credentials
if (IS_DEV && !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ No-error client: Missing Supabase API key. ' +
    'This client will use fallback data instead of connecting to Supabase. ' +
    'Set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for real data.'
  );
}

// Create a real Supabase client for actual API calls
const realClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    // Disable the built-in error UI
    global: {
      headers: {
        'X-Disable-Error-UI': 'true'
      }
    }
  }
);

// Create a fake client that never shows errors
const noErrorClient = {
  // Auth methods
  auth: {
    getSession: async () => {
      try {
        return await realClient.auth.getSession();
      } catch (error) {
        console.error('Auth error intercepted:', error);
        return { data: { session: null }, error: null };
      }
    },
    onAuthStateChange: (callback: any) => {
      try {
        return realClient.auth.onAuthStateChange(callback);
      } catch (error) {
        console.error('Auth state change error intercepted:', error);
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      }
    },
    signInWithPassword: async (credentials: any) => {
      try {
        return await realClient.auth.signInWithPassword(credentials);
      } catch (error) {
        console.error('Sign in error intercepted:', error);
        return { data: { user: null, session: null }, error: null };
      }
    },
    signOut: async () => {
      try {
        return await realClient.auth.signOut();
      } catch (error) {
        console.error('Sign out error intercepted:', error);
        return { error: null };
      }
    },
    signUp: async (credentials: any) => {
      try {
        return await realClient.auth.signUp(credentials);
      } catch (error) {
        console.error('Sign up error intercepted:', error);
        return { data: { user: null, session: null }, error: null };
      }
    },
    resetPasswordForEmail: async (email: string, options?: any) => {
      try {
        return await realClient.auth.resetPasswordForEmail(email, options);
      } catch (error) {
        console.error('Reset password error intercepted:', error);
        return { data: {}, error: null };
      }
    },
    signInWithOAuth: async (options: any) => {
      try {
        return await realClient.auth.signInWithOAuth(options);
      } catch (error) {
        console.error('OAuth sign in error intercepted:', error);
        return { data: {}, error: null };
      }
    },
    signInWithOtp: async (options: any) => {
      try {
        return await realClient.auth.signInWithOtp(options);
      } catch (error) {
        console.error('OTP sign in error intercepted:', error);
        return { data: {}, error: null };
      }
    },
    verifyOtp: async (options: any) => {
      try {
        return await realClient.auth.verifyOtp(options);
      } catch (error) {
        console.error('OTP verification error intercepted:', error);
        return { data: { user: null, session: null }, error: null };
      }
    }
  },

  // Database methods
  from: (table: string) => {
    return {
      select: (columns: string = '*') => {
        return {
          order: (column: string, options: any) => {
            return {
              limit: async (limit: number) => {
                try {
                  const result = await realClient.from(table).select(columns).order(column, options).limit(limit);
                  if (result.error) {
                    console.error(`Database error intercepted for ${table}:`, result.error);

                    // Return fallback data based on the table
                    if (table === 'deals') {
                      return { data: fallbackDeals.slice(0, limit), error: null };
                    } else if (table === 'events') {
                      return { data: fallbackEvents.slice(0, limit), error: null };
                    }

                    return { data: [], error: null };
                  }
                  return result;
                } catch (error) {
                  console.error(`Database error intercepted for ${table}:`, error);

                  // Return fallback data based on the table
                  if (table === 'deals') {
                    return { data: fallbackDeals.slice(0, limit), error: null };
                  } else if (table === 'events') {
                    return { data: fallbackEvents.slice(0, limit), error: null };
                  }

                  return { data: [], error: null };
                }
              },
              async execute() {
                try {
                  const result = await realClient.from(table).select(columns).order(column, options);
                  if (result.error) {
                    console.error(`Database error intercepted for ${table}:`, result.error);

                    // Return fallback data based on the table
                    if (table === 'deals') {
                      return { data: fallbackDeals, error: null };
                    } else if (table === 'events') {
                      return { data: fallbackEvents, error: null };
                    }

                    return { data: [], error: null };
                  }
                  return result;
                } catch (error) {
                  console.error(`Database error intercepted for ${table}:`, error);

                  // Return fallback data based on the table
                  if (table === 'deals') {
                    return { data: fallbackDeals, error: null };
                  } else if (table === 'events') {
                    return { data: fallbackEvents, error: null };
                  }

                  return { data: [], error: null };
                }
              }
            };
          },
          async execute() {
            try {
              const result = await realClient.from(table).select(columns);
              if (result.error) {
                console.error(`Database error intercepted for ${table}:`, result.error);

                // Return fallback data based on the table
                if (table === 'deals') {
                  return { data: fallbackDeals, error: null };
                } else if (table === 'events') {
                  return { data: fallbackEvents, error: null };
                }

                return { data: [], error: null };
              }
              return result;
            } catch (error) {
              console.error(`Database error intercepted for ${table}:`, error);

              // Return fallback data based on the table
              if (table === 'deals') {
                return { data: fallbackDeals, error: null };
              } else if (table === 'events') {
                return { data: fallbackEvents, error: null };
              }

              return { data: [], error: null };
            }
          }
        };
      }
    };
  }
};

// Export the no-error client
export const supabase = noErrorClient as any;
