import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PhoneLoginProps {
  onClose?: () => void;
}

const PhoneLogin = ({ onClose }: PhoneLoginProps) => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [formError, setFormError] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const { signInWithPhone, verifyPhoneOtp, signUpWithPhone, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!phone) {
      setFormError("Please enter your phone number");
      return;
    }

    try {
      if (!showVerification) {
        await signInWithPhone(phone);
        setShowVerification(true);
      } else {
        if (!verificationCode) {
          setFormError("Please enter the verification code");
          return;
        }
        await verifyPhoneOtp(phone, verificationCode);
        if (onClose) onClose();
      }
    } catch (error) {
      // Error is already handled by the auth context
      setFormError("Invalid phone number or verification code. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!registerPhone) {
      setFormError("Please enter your phone number");
      return;
    }

    try {
      // Include metadata for merchant registration if provided
      const metadata = businessName || location ? {
        business_name: businessName || undefined,
        location: location || undefined,
        role: businessName ? 'merchant' : 'user'
      } : undefined;

      await signUpWithPhone(registerPhone, metadata);
      setShowVerification(true);

      toast.success("Verification code sent", {
        description: "Please check your phone for the verification code."
      });
    } catch (error) {
      handleError(error, {
        title: "Registration failed",
        message: "Could not create your account. Please try again."
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {!showVerification ? (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+27 XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your phone number with country code (e.g., +27 for South Africa)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  placeholder="Enter the code sent to your phone"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {!showVerification ? "Send Verification Code" : "Verify & Sign In"}
            </Button>

            {showVerification && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode("");
                }}
                disabled={loading}
              >
                Back to Phone Entry
              </Button>
            )}
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4 mt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="registerPhone">Phone Number</Label>
              <Input
                id="registerPhone"
                placeholder="+27 XX XXX XXXX"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Enter your phone number with country code (e.g., +27 for South Africa)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name (Optional - for Merchants)</Label>
              <Input
                id="businessName"
                placeholder="Your business name if you're a merchant"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g. Cape Town, Johannesburg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              Register with Phone
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhoneLogin;
