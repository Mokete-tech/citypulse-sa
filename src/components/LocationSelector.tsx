
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Locate, X } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

const LocationSelector = () => {
  const { location, isLoading, getCurrentLocation, setManualLocation, clearLocation } = useLocation();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [manualProvince, setManualProvince] = useState('');

  const southAfricanProvinces = [
    'Western Cape',
    'Gauteng', 
    'KwaZulu-Natal',
    'Eastern Cape',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Free State',
    'Northern Cape'
  ];

  const handleManualSubmit = () => {
    if (manualCity && manualProvince) {
      setManualLocation(manualCity, manualProvince);
      setShowManualInput(false);
      setManualCity('');
      setManualProvince('');
    }
  };

  if (location && !showManualInput) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <MapPin className="w-4 h-4 text-blue-600" />
        <span className="text-gray-700">
          {location.city ? `${location.city}, ${location.province}` : 'Location detected'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowManualInput(true)}
          className="h-6 px-2 text-xs"
        >
          Change
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearLocation}
          className="h-6 px-1 text-xs"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  if (showManualInput) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Set Your Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your city (e.g., Cape Town)"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
          />
          <Select value={manualProvince} onValueChange={setManualProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Select your province" />
            </SelectTrigger>
            <SelectContent>
              {southAfricanProvinces.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button 
              onClick={handleManualSubmit}
              disabled={!manualCity || !manualProvince}
              className="flex-1"
            >
              Set Location
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowManualInput(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        <Locate className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Finding...' : 'Use My Location'}</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowManualInput(true)}
        className="flex items-center space-x-2"
      >
        <MapPin className="w-4 h-4" />
        <span>Set Manually</span>
      </Button>
    </div>
  );
};

export default LocationSelector;
