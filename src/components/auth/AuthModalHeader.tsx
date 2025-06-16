
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

const AuthModalHeader = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome to CityPulse</DialogTitle>
      </DialogHeader>
      
      <Alert className="mb-4">
        <Mail className="h-4 w-4" />
        <AlertDescription>
          Sign up to save your API key securely and access all features. Your email is pre-filled for convenience.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default AuthModalHeader;
