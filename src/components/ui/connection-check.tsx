import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export function ConnectionCheck() {
  // In production, don't show the connection error at all
  // This is a temporary fix until we properly set up the environment variables
  if (import.meta.env.PROD) {
    return null;
  }

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ error?: string; details?: any } | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    const result = await checkSupabaseConnection();
    setIsConnected(result.success);
    setErrorDetails(result.success ? null : { error: result.error, details: result.details });
    setIsChecking(false);
  };

  useEffect(() => {
    // Only check connection in development
    if (import.meta.env.DEV) {
      checkConnection();
    } else {
      // In production, don't show the connection error
      setIsConnected(true);
      setIsChecking(false);
    }
  }, []);

  // Don't show anything if connected or still checking initially
  if (isConnected === true || isConnected === null) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Unable to connect to the database. This may affect login, registration, and other features.
        </p>
        {errorDetails?.error && (
          <div className="text-sm bg-red-50 p-2 rounded border border-red-200 mt-1">
            <strong>Error:</strong> {errorDetails.error}
            {errorDetails.details?.code && (
              <div className="mt-1">
                <strong>Code:</strong> {errorDetails.details.code}
              </div>
            )}
            {errorDetails.details?.VITE_SUPABASE_URL !== undefined && (
              <div className="mt-2 text-xs">
                <strong>Environment Variables:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>VITE_SUPABASE_URL: {errorDetails.details.VITE_SUPABASE_URL ? 'Set' : 'Not set'}</li>
                  <li>NEXT_PUBLIC_SUPABASE_URL: {errorDetails.details.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</li>
                  <li>VITE_SUPABASE_ANON_KEY: {errorDetails.details.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {errorDetails.details.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</li>
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Try Again'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => window.open('https://app.supabase.com/project/qghojdkspxhyjeurxagx', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
