import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export function EnvWarning() {
  // Check if required environment variables are set
  const missingRequiredVars = [];
  const missingOptionalVars = [];

  // Required variables
  // Check for Supabase URL (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingRequiredVars.push('VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  // Check for Supabase Anon Key (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missingRequiredVars.push('VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Optional variables
  // Check for Stripe publishable key (either VITE_ or NEXT_PUBLIC_ prefix)
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && !import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    missingOptionalVars.push('VITE_STRIPE_PUBLISHABLE_KEY');
  }

  // If all required vars are set, only show info for optional vars
  if (missingRequiredVars.length === 0) {
    // If no optional vars are missing either, don't show anything
    if (missingOptionalVars.length === 0) {
      return null;
    }

    // Show info alert for missing optional vars
    return (
      <Alert variant="default" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Environment Configuration Warning</AlertTitle>
        <AlertDescription>
          ⚠️ Some optional environment variables are missing. Check console for details.
        </AlertDescription>
      </Alert>
    );
  }

  // Show warning for missing required vars
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Critical Environment Warning</AlertTitle>
      <AlertDescription>
        <p>
          The following <strong>required</strong> environment variables are missing:
        </p>
        <ul className="list-disc pl-5 mt-2">
          {missingRequiredVars.map(variable => (
            <li key={variable}>{variable}</li>
          ))}
        </ul>
        {missingOptionalVars.length > 0 && (
          <>
            <p className="mt-3">
              The following <strong>optional</strong> environment variables are also missing:
            </p>
            <ul className="list-disc pl-5 mt-2">
              {missingOptionalVars.map(variable => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-2">
          Please check your <code>.env</code> file or environment configuration.
        </p>
      </AlertDescription>
    </Alert>
  );
}
