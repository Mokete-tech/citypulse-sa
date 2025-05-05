import React, { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';

/**
 * Component that shows an indicator when the app is offline or Supabase is unreachable
 */
const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    // Check Supabase availability
    const checkSupabase = async () => {
      try {
        // Simple health check - just try to fetch the Supabase health endpoint
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        if (!supabaseUrl) return;

        const healthUrl = `${supabaseUrl}/rest/v1/`;
        const response = await fetch(healthUrl, {
          method: 'HEAD',
          headers: {
            'Content-Type': 'application/json',
          },
          // Short timeout to avoid hanging
          signal: AbortSignal.timeout(3000),
        });

        setSupabaseAvailable(response.ok);
      } catch (error) {
        console.error('Supabase health check failed:', error);
        setSupabaseAvailable(false);
      }
    };

    // Check Supabase availability initially and every 30 seconds
    checkSupabase();
    const interval = setInterval(checkSupabase, 30000);

    // Update banner visibility
    const updateBanner = () => {
      setShowBanner(!isOnline || !supabaseAvailable);
    };

    // Update banner when status changes
    updateBanner();
    const bannerInterval = setInterval(updateBanner, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
      clearInterval(bannerInterval);
    };
  }, [isOnline, supabaseAvailable]);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 z-50 flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm">
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You are offline. Some features may not work properly.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span>Connection issues detected. Some features may not work properly.</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
