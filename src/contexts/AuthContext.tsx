import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthUser, AuthError, SignInParams, SignUpParams, SignInResponse, SignUpResponse } from './AuthContextTypes';

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

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  userRole: string | null;
  isAdmin: boolean;
  isMerchant: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => {},
  userRole: null,
  isAdmin: false,
  isMerchant: false,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const handleError = (error: unknown): AuthError => {
    if (error instanceof Error) {
      return {
        code: 'AUTH_ERROR',
        message: error.message,
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    };
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const params: SignInParams = { identifier: email, password };
      const response: SignInResponse = await clerk.client.signIn.create(params);
      
      if (response.status === 'complete') {
        const user = await clerk.user;
        setState({
          user: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            role: 'user',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const authError = handleError(error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));
      toast.error('Login failed', {
        description: authError.message,
      });
    }
  };

  const signup = async (email: string, password: string, userData: Partial<AuthUser>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const params: SignUpParams = {
        emailAddress: email,
        password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        metadata: { role: userData.role },
      };
      const response: SignUpResponse = await clerk.client.signUp.create(params);
      
      if (response.status === 'complete') {
        const user = await clerk.user;
        setState({
          user: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            role: userData.role || 'user',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const authError = handleError(error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));
      toast.error('Signup failed', {
        description: authError.message,
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      toast.success('Signed out successfully');
    } catch (error) {
      const authError = handleError(error);
      toast.error('Sign out failed', {
        description: authError.message,
      });
      throw authError;
    }
  };

  // Get user role from metadata
  const userRole = state.user?.app_metadata?.role || null;
  const isAdmin = userRole === 'admin';
  const isMerchant = userRole === 'merchant';

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login,
      signup,
      logout: signOut,
      updateProfile: async () => {},
      resetPassword: async () => {},
      verifyEmail: async () => {},
      userRole,
      isAdmin,
      isMerchant,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
