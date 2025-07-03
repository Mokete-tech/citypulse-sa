
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { User, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface AuthSignUpFormProps {
  onClose: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const AuthSignUpForm = ({ onClose, onBack, showBack = false }: AuthSignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name Required", {
        description: "Please enter your full name to create an account.",
      });
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account Created Successfully!", {
        description: "Please check your email for a confirmation link. After clicking it, you can sign in to save your API key permanently.",
        duration: 10000
      });
      onClose();
    } catch (error) {
      toast.error("Sign Up Error", { description: (error as Error).message });
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSignUp} className="space-y-5">
      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
              required
            />
          </div>
        </div>

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
              placeholder="Choose a strong password"
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
              required
              minLength={6}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Account
          </div>
        )}
      </Button>

      <div className="text-center">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
            🎉 You'll receive a confirmation email to verify your account
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthSignUpForm;
