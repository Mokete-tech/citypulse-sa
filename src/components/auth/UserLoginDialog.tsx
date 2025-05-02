import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Mail, Phone, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
            Access your account to save deals, track events, and more.
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
                <Facebook className="h-4 w-4 mr-2" />
                Continue with Facebook
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
                  placeholder="+27 XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Phone className="h-4 w-4 mr-2" />
                Login with Phone
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserLoginDialog;
