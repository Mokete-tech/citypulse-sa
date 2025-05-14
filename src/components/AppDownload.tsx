import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCode } from '@/components/ui/qr-code';
import { Smartphone, Download, Apple, Tablet } from 'lucide-react';

interface AppDownloadProps {
  className?: string;
}

/**
 * Component for displaying app download options with QR codes
 */
export function AppDownload({ className }: AppDownloadProps) {
  // App store links
  const appStoreLink = 'https://apps.apple.com/app/citypulse-sa/id123456789';
  const playStoreLink = 'https://play.google.com/store/apps/details?id=com.citypulse.sa';
  const webAppLink = 'https://citypulse-sa.vercel.app';

  // Detect device type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Get appropriate store link based on device
  const getPrimaryStoreLink = () => {
    if (isIOS) return appStoreLink;
    if (isAndroid) return playStoreLink;
    return webAppLink;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Get the CityPulse App
        </CardTitle>
        <CardDescription>
          Download our mobile app for the best experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 flex flex-col items-center">
            <QRCode
              value={webAppLink}
              size={150}
              level="M"
              includeMargin
              className="mb-4"
              imageSettings={{
                src: '/logo.png',
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
            <p className="text-sm text-center text-muted-foreground mb-2">
              Scan to download or visit our web app
            </p>
            <Button
              variant="default"
              className="w-full"
              onClick={() => window.open(getPrimaryStoreLink(), '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Now
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Available on:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-start"
                  onClick={() => window.open(appStoreLink, '_blank')}
                >
                  <Apple className="h-4 w-4 mr-2" />
                  App Store
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start"
                  onClick={() => window.open(playStoreLink, '_blank')}
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.704 0 .253.097.495.271.675.347.347.908.347 1.254 0l10.172-10.172c.181-.181.29-.435.29-.704 0-.253-.097-.495-.271-.675L4.863 1.843C4.516 1.496 3.956 1.496 3.609 1.814z" />
                    <path d="M14.727 1.814L24.91 12 14.727 22.186c-.181.181-.29.435-.29.704 0 .253.097.495.271.675.347.347.908.347 1.254 0l10.172-10.172c.181-.181.29-.435.29-.704 0-.253-.097-.495-.271-.675L15.981 1.843c-.347-.347-.908-.347-1.254 0z" />
                  </svg>
                  Play Store
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">App Features:</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">
                    <Smartphone className="h-3 w-3" />
                  </span>
                  Real-time notifications for new deals
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">
                    <Tablet className="h-3 w-3" />
                  </span>
                  Offline access to saved deals
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">
                    <Download className="h-3 w-3" />
                  </span>
                  Faster browsing experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AppDownload;
