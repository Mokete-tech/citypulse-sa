import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

import { useAuth } from '@/contexts/AuthContext';

interface UserLoginDialogProps {
  className?: string;
}

const UserLoginDialog = ({ className }: UserLoginDialogProps) => {
  const { signInWithEmail, signInWithFacebook, signInWithGoogle, signInWithPhone, sendPhoneVerification, loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      setOpen(false);
    } catch (error) {
      console.error('Email login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
      setOpen(false);
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { success, error } = await sendPhoneVerification(phone);

      if (success) {
        setCodeSent(true);
        toast.success('Verification code sent', {
          description: 'Please check your phone for the verification code.'
        });
      } else {
        toast.error('Failed to send verification code', {
          description: error || 'Please check the phone number and try again.'
        });
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('Failed to send verification code', {
        description: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!codeSent) {
        await handleSendVerificationCode(e);
        return;
      }

      await signInWithPhone(phone, verificationCode);
      setOpen(false);
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error('Authentication failed', {
        description: 'Failed to verify the code. Please try again.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <LogIn className="h-4 w-4 mr-2" />
          <span>Member Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to CityPulse</DialogTitle>
          <DialogDescription>
            Access your account to save deals, track events, and more. New users will be automatically registered.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Mail className="h-4 w-4 mr-2" />
                Login with Email
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>Don't have an account? New users will be automatically registered when you login.</p>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="facebook">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Login or create an account using your Facebook profile.
              </p>
              <Button
                type="button"
                className="w-full bg-[#1877F2] hover:bg-[#0C63D4]"
                onClick={() => {
                  toast.info("Facebook login is coming soon");
                }}
                disabled={loading}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="google">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Login or create an account using your Google account.
              </p>
              <Button
                type="button"
                className="w-full bg-[#4285F4] hover:bg-[#3367D6]"
                onClick={() => {
                  toast.info("Google login is coming soon");
                }}
                disabled={loading}
              >
                Continue with Google
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {codeSent && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter the code sent to your phone"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                <Phone className="h-4 w-4 mr-2" />
                {codeSent ? 'Verify Code' : 'Send Verification Code'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserLoginDialog;
