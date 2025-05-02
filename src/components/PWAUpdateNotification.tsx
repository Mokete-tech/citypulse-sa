import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Component that shows a notification when a new version of the PWA is available
 */
const PWAUpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Listen for new service worker updates
      const handleUpdate = (reg: ServiceWorkerRegistration) => {
        if (reg.waiting) {
          setUpdateAvailable(true);
          setRegistration(reg);
        }
      };

      // Check for existing service worker registration
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          setUpdateAvailable(true);
          setRegistration(reg);
        }
      });

      // Listen for new service worker installations
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Listen for new service worker updates
      window.addEventListener('sw-update-found', () => {
        navigator.serviceWorker.getRegistration().then(handleUpdate);
      });
    }
  }, []);

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Send a message to the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-white shadow-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span>A new version is available!</span>
        <Button 
          size="sm" 
          variant="default" 
          className="ml-4" 
          onClick={updateServiceWorker}
        >
          Update Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default PWAUpdateNotification;
