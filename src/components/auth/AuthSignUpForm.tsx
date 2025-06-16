
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthSignUpFormProps {
  onClose: () => void;
}

const AuthSignUpForm = ({ onClose }: AuthSignUpFormProps) => {
  const [email, setEmail] = useState('nzimandevelley@outlook.com');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({ 
        title: "Full Name Required", 
        description: "Please enter your full name to create an account.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast({ 
        title: "Account Created Successfully!", 
        description: "Please check your email for a confirmation link. After clicking it, you can sign in to save your API key permanently.",
        duration: 10000
      });
      onClose();
    } catch (error: any) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
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
          placeholder="Choose a strong password"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
      <p className="text-sm text-gray-600 text-center">
        You'll receive a confirmation email to verify your account.
      </p>
    </form>
  );
};

export default AuthSignUpForm;
