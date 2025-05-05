import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Redirect to home page or dashboard based on user role
          const userRole = data.session.user.app_metadata?.role;

          if (userRole === 'merchant') {
            navigate('/merchant/dashboard');
          } else if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          // If no session, redirect to home
          navigate('/');
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'An error occurred during authentication');
        // Redirect to home after a delay if there's an error
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-gray-500">Redirecting you to the home page...</p>
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-sa-blue mb-4" />
            <h1 className="text-2xl font-bold mb-2">Completing Authentication</h1>
            <p className="text-gray-600">Please wait while we log you in...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuthCallback;
