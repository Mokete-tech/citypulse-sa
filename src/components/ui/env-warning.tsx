
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import { checkEnvironmentVariables } from '@/lib/env-checker';

export function EnvWarning() {
  // Only show warnings in development mode when explicitly enabled
  const showWarnings = import.meta.env.VITE_SHOW_ENV_WARNINGS === 'true';
  
  // If warnings are disabled, don't show any warnings
  if (!showWarnings) {
    return null;
  }
  
  const { isValid, missingVars, warnings, usingFallbacks } = checkEnvironmentVariables();
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  // In production, only show critical errors
  if (!isDev && isValid) {
    return null;
  }

  // Don't show any warnings in production for non-critical issues
  if (!isDev && missingVars.length === 0) {
    return null;
  }

  // If everything is configured properly, don't show any warning
  if (isValid && warnings.length === 0 && !usingFallbacks) {
    return (
      <Alert variant="default" className="mb-6 bg-green-50 border-green-200 text-green-800">
        <Shield className="h-4 w-4" />
        <AlertTitle>Environment Configured</AlertTitle>
        <AlertDescription>
          All required environment variables are properly set.
        </AlertDescription>
      </Alert>
    );
  }

  // Show critical warning for missing required variables
  if (!isValid) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Critical Environment Warning</AlertTitle>
        <AlertDescription>
          <p>
            The following <strong>required</strong> environment variables are missing:
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

  return null; // Don't show optional warnings at all
}
