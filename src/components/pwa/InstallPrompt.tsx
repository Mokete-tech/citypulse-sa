import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Only show the prompt if the app is not installed
    if (!isAppInstalled) {
      // Check if the user has dismissed the prompt in the last 30 days
      const lastPromptTime = localStorage.getItem('installPromptDismissed');
      if (lastPromptTime) {
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(lastPromptTime, 10) < thirtyDaysInMs) {
          return;
        }
      }
      
      // Show the prompt after 5 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Handle the install button click
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setShowPrompt(false);
  };
  
  // Handle the dismiss button click
  const handleDismiss = () => {
    // Save the current time to localStorage
    localStorage.setItem('installPromptDismissed', Date.now().toString());
    setShowPrompt(false);
  };
  
  // Generate QR code URL for the current site
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin)}`;
  
  if (!showPrompt) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="border-blue-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Install CityPulse App</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Install our app for a better experience and offline access to deals and events.
          </p>
          
          <div className="flex flex-col gap-2">
            {!isIOS && installPrompt && (
              <Button onClick={handleInstallClick} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            )}
            
            {isIOS && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md mb-2">
                <p className="font-medium mb-1">To install on iOS:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Tap the share button</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right</li>
                </ol>
              </div>
            )}
            
            <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Get on Another Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan to Install CityPulse</DialogTitle>
                  <DialogDescription>
                    Scan this QR code with your mobile device to visit CityPulse and install the app.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  {window.location.origin}
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;
