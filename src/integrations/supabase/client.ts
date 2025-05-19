
import { createClient } from '@supabase/supabase-js';

// Use environment variables, with fallbacks to prevent initialization errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                   import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                   'https://qghojdkspxhyjeurxagx.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTU4NjUsImV4cCI6MjA2MDIzMTg2NX0.QInil2Wr7x14JwpRKKkIcgG6WwyOIUFx-O_kL8o2jdg';

// Add some logging in development mode to help debug
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseAnonKey ? '[Key is set]' : '[Key is NOT set]');
}

// Ensure both values are strings to prevent TypeScript/runtime errors
export const supabase = createClient(
  String(supabaseUrl), 
  String(supabaseAnonKey),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storageKey: 'citypulse_auth_token',
    }
  }
);
