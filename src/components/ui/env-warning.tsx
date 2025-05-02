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
  
  if (!import.meta.env.VITE_SUPABASE_URL) {
    missingVars.push('VITE_SUPABASE_URL');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
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
