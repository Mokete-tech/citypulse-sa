import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export function ConnectionCheck() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ error?: string; details?: any } | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  const checkConnection = async () => {
    setIsChecking(true);
    const result = await checkSupabaseConnection();
    setIsConnected(result.success);
    setErrorDetails(result.success ? null : { error: result.error, details: result.details });
    setIsChecking(false);
  };

  useEffect(() => {
    // Only check connection once on initial load
    // This prevents constant checking that might trigger rate limits
    checkConnection();
  }, []);

  // Don't show anything if connected, still checking initially, or alert dismissed
  if (isConnected === true || isConnected === null || !showAlert) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6 relative">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => setShowAlert(false)}
      >
        <span className="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </Button>
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
