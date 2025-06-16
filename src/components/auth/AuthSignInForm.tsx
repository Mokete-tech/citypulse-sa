
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthSignInFormProps {
  onClose: () => void;
}

const AuthSignInForm = ({ onClose }: AuthSignInFormProps) => {
  const [email, setEmail] = useState('nzimandevelley@outlook.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
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
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};

export default AuthSignInForm;
