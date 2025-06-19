
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, LogIn, ArrowLeft, Zap } from 'lucide-react';

interface AuthSignInFormProps {
  onClose: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const AuthSignInForm = ({ onClose, onBack, showBack = false }: AuthSignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      onClose();
    } catch (error: any) {
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email Not Confirmed",
          description: "Please check your email and click the confirmation link to verify your account.",
          variant: "destructive"
        });
      } else if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password, or sign up if you don't have an account yet.",
          variant: "destructive"
        });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }

    setMagicLinkLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/ai-assistant`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Magic Link Sent!",
        description: `Check your email at ${email} for a sign-in link.`
      });

    } catch (error: any) {
      console.error('Magic link error:', error);
      toast({
        title: "Magic Link Error",
        description: error.message || "Failed to send magic link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to options
        </Button>
      )}

      <form onSubmit={handleSignIn} className="space-y-5">
        <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
              required
            />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
              required
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing In...
          </div>
        ) : (
          <div className="flex items-center">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </div>
        )}
      </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Don't have an account? Switch to the Sign Up tab above
          </p>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleMagicLink}
        disabled={magicLinkLoading || !email.trim()}
        className="w-full h-12 border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 font-medium rounded-xl transition-all duration-200"
      >
        {magicLinkLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            Sending Magic Link...
          </div>
        ) : (
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Send Magic Link
          </div>
        )}
      </Button>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-700 text-center">
          💡 <strong>Magic Link:</strong> No password needed! We'll email you a secure sign-in link.
        </p>
      </div>
    </div>
  );
};

export default AuthSignInForm;
