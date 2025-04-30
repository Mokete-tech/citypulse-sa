import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getEnvironmentWarningMessage } from '@/lib/env-checker';

interface EnvWarningProps {
  showInProduction?: boolean;
}

/**
 * Component to display environment configuration warnings
 * Only shows in development mode by default
 */
export function EnvWarning({ showInProduction = false }: EnvWarningProps) {
  const [message, setMessage] = useState<string | null>(null);
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

  useEffect(() => {
    // Only check and show warnings in development mode unless explicitly enabled for production
    if (isDev || showInProduction) {
      setMessage(getEnvironmentWarningMessage());
    }
  }, [showInProduction]);

  // Don't render anything if there's no message or we're in production and not showing warnings
  if (!message || (!isDev && !showInProduction)) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Environment Configuration Warning</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
