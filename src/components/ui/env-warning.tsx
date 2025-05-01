import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getEnvironmentWarningMessage } from '@/lib/env-checker';
import { isUsingFallbackCredentials } from '@/integrations/supabase/client';

interface EnvWarningProps {
  showInProduction?: boolean;
}

/**
 * Component to display environment configuration warnings
 * Only shows in development mode by default
 */
export function EnvWarning({ showInProduction = true }: EnvWarningProps) {
  const [message, setMessage] = useState<string | null>(null);
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

  useEffect(() => {
    // Always check for fallback credentials
    if (isUsingFallbackCredentials) {
      setMessage('Using demo mode with sample data. Some features may be limited.');
    } else if (isDev || showInProduction) {
      // Only check other warnings in development mode or if explicitly enabled
      setMessage(getEnvironmentWarningMessage());
    }
  }, [showInProduction]);

  // Don't render anything if there's no message
  if (!message) {
    return null;
  }

  // In production, only show a simplified message for fallback credentials
  if (!isDev && isUsingFallbackCredentials) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This site is running in demo mode with sample data. Some features may be limited.
        </AlertDescription>
      </Alert>
    );
  }

  // Full warning for development or when explicitly enabled
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Environment Configuration Warning</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
