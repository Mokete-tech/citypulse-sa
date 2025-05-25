import { User } from '@clerk/clerk-react';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'user' | 'merchant' | 'admin';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'merchant' | 'admin';
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role?: 'user' | 'merchant' | 'admin';
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

export interface AuthConfig {
  apiUrl: string;
  tokenKey: string;
  refreshTokenKey: string;
  tokenExpiryKey: string;
}

// Extend the LoadedClerk type with the methods we need
export interface ExtendedClerk {
  signOut: () => Promise<void>;
  client: {
    signIn: {
      create: (params: any) => Promise<any>;
      attemptFirstFactor: (params: any) => Promise<any>;
    };
    signUp: {
      create: (params: any) => Promise<any>;
    };
  };
  authenticateWithRedirect: (params: {
    strategy: string;
    redirectUrl: string;
    redirectUrlComplete?: string;
  }) => Promise<any>;
}
