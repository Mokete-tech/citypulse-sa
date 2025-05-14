/**
 * Unified Supabase Client
 * 
 * This file provides a single, consistent Supabase client for the entire application.
 * It handles environment variables, error handling, and fallback data.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { fallbackDeals, fallbackEvents } from '@/data/fallback-data';
import { toast } from 'sonner';

// Environment variable configuration
const ENV_CONFIG = {
  // Default Supabase project URL - this is just the project URL, not a secret
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
  SUPABASE_ANON_KEY === ENV_CONFIG.DEFAULT_SUPABASE_ANON_KEY ||
  !SUPABASE_ANON_KEY
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

// Create the Supabase client with error handling
const supabaseClient = createClient<Database>(
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

// Create a proxy to handle errors and provide fallback data
const supabaseProxy = new Proxy(supabaseClient, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    
    // Special handling for the 'from' method to provide fallback data
    if (prop === 'from') {
      return function(table: string) {
        // Get the original 'from' method result
        const originalFrom = value.call(target, table);
        
        // Create a proxy for the 'from' result
        return new Proxy(originalFrom, {
          get(fromTarget, fromProp, fromReceiver) {
            const fromValue = Reflect.get(fromTarget, fromProp, fromReceiver);
            
            // If it's the 'select' method, wrap it
            if (fromProp === 'select') {
              return function(...args: any[]) {
                const originalSelect = fromValue.apply(fromTarget, args);
                
                // Add error handling to the execute method
                const originalExecute = originalSelect.execute;
                if (originalExecute) {
                  originalSelect.execute = async function() {
                    try {
                      const result = await originalExecute.apply(this);
                      return result;
                    } catch (error) {
                      console.error(`Database error for ${table}:`, error);
                      
                      // Return fallback data based on the table
                      if (table === 'deals') {
                        return { data: fallbackDeals, error: null };
                      } else if (table === 'events') {
                        return { data: fallbackEvents, error: null };
                      }
                      
                      // For other tables, return empty array
                      return { data: [], error: null };
                    }
                  };
                }
                
                return originalSelect;
              };
            }
            
            return fromValue;
          }
        });
      };
    }
    
    // If the property is a function, wrap it to handle errors
    if (typeof value === 'function') {
      return function(...args: any[]) {
        try {
          const result = value.apply(target, args);
          
          // If the result is a Promise, handle any errors
          if (result instanceof Promise) {
            return result.catch((error) => {
              console.error('Supabase error:', error);
              
              // Show a toast notification in development
              if (IS_DEV) {
                toast.error('Supabase Error', {
                  description: error.message || 'An error occurred with the database connection',
                });
              }
              
              // Return a standardized error response
              return {
                data: null,
                error: {
                  message: error.message || 'Database error',
                  details: error,
                  code: error.code || 'unknown'
                }
              };
            });
          }
          
          return result;
        } catch (error: any) {
          console.error('Supabase synchronous error:', error);
          
          // Show a toast notification in development
          if (IS_DEV) {
            toast.error('Supabase Error', {
              description: error.message || 'An error occurred with the database connection',
            });
          }
          
          // Return a standardized error response
          return {
            data: null,
            error: {
              message: error.message || 'Database error',
              details: error,
              code: error.code || 'unknown'
            }
          };
        }
      };
    }
    
    return value;
  }
});

// Export the proxied client
export const supabase = supabaseProxy as SupabaseClient<Database>;

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
    const { data, error } = await supabase.from('deals').select('id').limit(1);

    if (error) {
      return {
        success: false,
        error: error.message || 'Database connection error',
        details: {
          error,
          usingDefaults
        }
      };
    }

    return {
      success: true,
      details: {
        data,
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
