import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/no-error-client';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  signUpWithPhone: (phone: string, metadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed properties for role checks
  const isAdmin = userRole === 'admin';
  const isMerchant = userRole === 'merchant';

  // Function to extract user role from session
  const extractUserRole = (session: Session | null): string | null => {
    if (!session || !session.user) return null;
    return session.user.app_metadata?.role || null;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractUserRole(session));
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setUserRole(extractUserRole(session));
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully');
    } catch (error: any) {
      handleError(error, {
        title: 'Authentication failed',
        message: error.message || 'Failed to sign in. Please check your credentials and try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success('Signed out successfully');
    } catch (error) {
      handleError(error, {
        title: 'Sign out failed',
        message: 'Failed to sign out. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Account created successfully', {
        description: 'Please check your email for a confirmation link.'
      });
    } catch (error) {
      handleError(error, {
        title: 'Registration failed',
        message: 'Failed to create account. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);

      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent', {
        description: 'Please check your email for a password reset link.'
      });
    } catch (error) {
      handleError(error, {
        title: 'Password reset failed',
        message: 'Failed to send password reset email. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        throw error;
      }

      // No success toast here as the page will redirect to Google
    } catch (error) {
      handleError(error, {
        title: 'Google sign in failed',
        message: 'Failed to sign in with Google. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        throw error;
      }

      // No success toast here as the page will redirect to Facebook
    } catch (error) {
      handleError(error, {
        title: 'Facebook sign in failed',
        message: 'Failed to sign in with Facebook. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Verification code sent', {
        description: 'Please check your phone for the verification code.'
      });
    } catch (error) {
      handleError(error, {
        title: 'Phone sign in failed',
        message: 'Failed to send verification code. Please check the phone number and try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully');
    } catch (error) {
      handleError(error, {
        title: 'Verification failed',
        message: 'Failed to verify the code. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, metadata?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Verification code sent', {
        description: 'Please check your phone for the verification code to complete your registration.'
      });
    } catch (error) {
      handleError(error, {
        title: 'Registration failed',
        message: 'Failed to create account. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    userRole,
    isAdmin,
    isMerchant,
    signIn,
    signOut,
    signUp,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    signInWithPhone,
    verifyPhoneOtp,
    signUpWithPhone
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
