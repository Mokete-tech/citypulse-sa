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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      setOpen(false);
    } catch (error) {
      console.error('Google login error:', error);
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
                onClick={handleFacebookLogin}
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
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
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
