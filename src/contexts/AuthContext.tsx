import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
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

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword
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
