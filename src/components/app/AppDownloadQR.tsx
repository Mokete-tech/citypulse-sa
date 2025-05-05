import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Smartphone } from 'lucide-react';

interface AppDownloadQRProps {
  className?: string;
}

const AppDownloadQR: React.FC<AppDownloadQRProps> = ({ className = '' }) => {
  // Generate QR code SVG (simplified version)
  const generateQRCode = () => {
    // This is a placeholder for a real QR code generator
    // In a real implementation, you would use a library like qrcode.react
    return (
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        <rect width="150" height="150" fill="white" />
        <rect x="20" y="20" width="110" height="110" fill="white" stroke="black" strokeWidth="2" />
        <rect x="35" y="35" width="20" height="20" fill="black" />
        <rect x="35" y="95" width="20" height="20" fill="black" />
        <rect x="95" y="35" width="20" height="20" fill="black" />
        <rect x="65" y="65" width="20" height="20" fill="black" />
        <rect x="95" y="95" width="20" height="20" fill="black" />
        <rect x="35" y="65" width="10" height="10" fill="black" />
        <rect x="65" y="35" width="10" height="10" fill="black" />
        <rect x="65" y="95" width="10" height="10" fill="black" />
        <rect x="95" y="65" width="10" height="10" fill="black" />
        <rect x="45" y="75" width="10" height="10" fill="black" />
        <rect x="75" y="45" width="10" height="10" fill="black" />
        <rect x="75" y="95" width="10" height="10" fill="black" />
        <rect x="85" y="75" width="10" height="10" fill="black" />
      </svg>
    );
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-center mb-4">Download Our App</h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Scan this QR code to download the CityPulse app for a better experience
        </p>
        
        {generateQRCode()}
        
        <div className="mt-6 flex flex-col space-y-2">
          <Button className="w-full bg-black hover:bg-gray-800 text-white">
            <Apple className="h-5 w-5 mr-2" />
            App Store
          </Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Smartphone className="h-5 w-5 mr-2" />
            Google Play
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Available for iOS and Android devices
        </p>
      </CardContent>
    </Card>
  );
};

export default AppDownloadQR;
