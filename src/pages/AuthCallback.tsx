import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/ui/loading-state';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';

/**
 * This component handles OAuth callbacks from providers like Google and Facebook.
 * It should be rendered at the /auth/callback route.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for errors in the URL
        const errorParam = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
        
        if (errorParam) {
          setError(errorDescription || 'Authentication failed');
          toast.error('Authentication failed', {
            description: errorDescription || 'Please try again'
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Exchange the code for a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Check if user has merchant role
          const userRole = data.session.user.app_metadata?.role;
          
          toast.success('Signed in successfully');
          
          // Redirect based on user role
          if (userRole === 'merchant') {
            navigate('/merchant/dashboard');
          } else {
            navigate('/');
          }
        } else {
          // No session found, redirect to home
          navigate('/');
        }
      } catch (err) {
        handleError(err, {
          title: 'Authentication failed',
          message: 'Failed to complete authentication. Please try again.'
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <p>Redirecting you back to the home page...</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-8">Completing Sign In</h1>
          <LoadingState isLoading={true} />
          <p className="mt-4">Please wait while we complete your authentication...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
