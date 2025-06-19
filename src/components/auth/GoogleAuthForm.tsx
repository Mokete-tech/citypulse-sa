import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoogleAuthFormProps {
  onBack: () => void;
  onClose: () => void;
}

const GoogleAuthForm = ({ onBack, onClose }: GoogleAuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/ai-assistant`,
        },
      });

      if (error) {
        throw error;
      }

      // The redirect will happen automatically, so we don't need to close the modal here
      toast({ 
        title: "Redirecting to Google", 
        description: "Please complete the sign-in process with Google." 
      });

    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({ 
        title: "Google Sign-In Error", 
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to options
      </Button>

      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <Chrome className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Continue with Google</h3>
          <p className="text-sm text-gray-600 mt-2">
            Sign in securely using your Google account
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-3"></div>
              Connecting to Google...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </div>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">Quick & Secure</p>
            <p className="text-xs text-blue-700 mt-1">
              No need to remember another password. Your Google account keeps you secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthForm;
