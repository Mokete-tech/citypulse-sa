import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function EnvWarning() {
  // Only show warning in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  // Check if required environment variables are set
  const missingVars = [];

  // Check for Supabase URL (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingVars.push('VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  // Check for Supabase Anon Key (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missingVars.push('VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Check for Stripe publishable key (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && !import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    missingVars.push('VITE_STRIPE_PUBLISHABLE_KEY or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  }

  // If all required vars are set, don't show warning
  if (missingVars.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Environment Warning</AlertTitle>
      <AlertDescription>
        <p>
          The following environment variables are missing:
        </p>
        <ul className="list-disc pl-5 mt-2">
          {missingVars.map(variable => (
            <li key={variable}>{variable}</li>
          ))}
        </ul>
        <p className="mt-2">
          Please check your <code>.env</code> file or environment configuration.
        </p>
      </AlertDescription>
    </Alert>
  );
}
