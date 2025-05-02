import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { isRunningAsPWA, getPlatform } from '@/utils/pwa-utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const platform = getPlatform();

  useEffect(() => {
    // Don't show the prompt if already running as PWA or if user dismissed it
    if (isRunningAsPWA() || localStorage.getItem('pwa-install-dismissed')) {
      return;
    }

    // For Android/Chrome: Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Show the prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // Show after 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS: Show a custom prompt after a delay
    if (platform === 'ios' && !localStorage.getItem('pwa-install-dismissed')) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // Show after 30 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [platform]);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPrompt(null);
    }
    
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Install CityPulse</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="-mt-1 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {platform === 'ios' 
              ? 'Add to your Home Screen for a better experience'
              : 'Install our app for a better experience'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {platform === 'ios' ? (
            <p className="text-sm text-muted-foreground">
              Tap <span className="inline-flex items-center">
                <svg className="h-4 w-4 mx-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span> 
              and then "Add to Home Screen"
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Install CityPulse to quickly access deals and events near you, even offline.
            </p>
          )}
        </CardContent>
        <CardFooter>
          {platform !== 'ios' && (
            <Button 
              className="w-full" 
              onClick={handleInstall}
              disabled={!installPrompt}
            >
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
          )}
          {platform === 'ios' && (
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={handleDismiss}
            >
              Got it
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
