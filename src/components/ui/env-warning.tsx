
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import { checkEnvironmentVariables } from '@/lib/env-checker';

export function EnvWarning() {
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

  // Log information in development mode
  if (isDev) {
    console.log('Environment check - Warnings:', warnings);
    console.log('Environment check - Missing required vars:', missingVars);
    console.log('Environment check - Using fallbacks:', usingFallbacks);
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

  // Show warning for using default credentials or other warnings
  // Changed from "warning" to "default" with warning styling
  return (
    <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
      <Info className="h-4 w-4" />
      <AlertTitle>Environment Configuration {usingFallbacks ? "Warning" : "Notice"}</AlertTitle>
      <AlertDescription>
        {usingFallbacks && (
          <p className="mb-2">⚠️ Using default Supabase configuration. Not recommended for production.</p>
        )}
        {warnings.length > 0 && (
          <>
            <p className="mb-1">Optional configuration issues:</p>
            <ul className="list-disc pl-5">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
