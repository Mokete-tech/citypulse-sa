import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export function ConnectionCheck() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await checkSupabaseConnection();
    setIsConnected(connected);
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (isConnected === true || isConnected === null) {
    return null; // Don't show anything if connected or still checking initially
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Unable to connect to the database. This may affect login, registration, and other features.
        </p>
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
      </AlertDescription>
    </Alert>
  );
}
