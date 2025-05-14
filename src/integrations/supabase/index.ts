/**
 * Supabase Integration Index
 * 
 * This file re-exports the Supabase client and related utilities
 * to provide a single import point for all Supabase functionality.
 */

// Export the unified Supabase client
export { 
  supabase, 
  isUsingDefaultCredentials, 
  checkSupabaseConnection 
} from './supabase-client';

// Export types
export type { Database } from './types';

// For backward compatibility, re-export from the old client files
// This ensures existing imports continue to work
export { 
  supabase as supabaseClient,
  isUsingDefaultCredentials as isUsingFallbackCredentials
} from './supabase-client';

// Log a message in development mode
if (import.meta.env.DEV) {
  console.log('Using unified Supabase client');
}
