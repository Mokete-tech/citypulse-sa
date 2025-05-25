import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    role?: string;
  };
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  session: Session | null;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Signed in successfully');
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

      toast.success('Account created successfully');
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
        redirectTo: `${window.location.origin}/auth/reset-password`
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed', {
        description: error.message || 'Could not sign out'
      });
      throw error;
    }
  };

  // Get user role from metadata
  const userRole = user?.app_metadata?.role || null;
  const isAdmin = userRole === 'admin';
  const isMerchant = userRole === 'merchant';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      session,
      isAdmin,
      isMerchant,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
