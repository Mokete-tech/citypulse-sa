import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthContextType } from './AuthContextTypes';
import { toast } from '@/components/ui/sonner';

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth methods using Supabase
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user role from metadata
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        setUserRole(profile?.role || 'user');
        toast.success('Signed in successfully');
      }

      return { success: true, data };
    } catch (error: any) {
      toast.error('Sign in failed', {
        description: error.message || 'Invalid credentials'
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with default role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              role: 'user',
              ...metadata
            }
          ]);

        if (profileError) throw profileError;

        toast.success('Account created successfully');
      }

      return { success: true, data };
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message || 'Could not create account'
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      toast.error('Google sign in failed', {
        description: error.message || 'Could not sign in with Google'
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      toast.error('Facebook sign in failed', {
        description: error.message || 'Could not sign in with Facebook'
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('Password reset email sent');
      return { success: true };
    } catch (error: any) {
      toast.error('Password reset failed', {
        description: error.message || 'Could not send reset email'
      });
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserRole(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error('Sign out failed', {
        description: error.message || 'Could not sign out'
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      session,
      isAdmin: userRole === 'admin',
      isMerchant: userRole === 'merchant',
      signIn,
      signUp,
      signOut: handleSignOut,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context
export { AuthContext };

// Export the useAuth hook
import { useAuth } from '../hooks/useAuth';
export { useAuth };
export default AuthProvider;
