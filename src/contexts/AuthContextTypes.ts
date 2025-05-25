import { User } from '@clerk/clerk-react';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'merchant' | 'admin';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  lastSignInAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, userData: Partial<AuthUser>) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
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
  code: 'INVALID_CREDENTIALS' | 'EMAIL_IN_USE' | 'INVALID_TOKEN' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
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

export interface SignInParams {
  emailAddress: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpParams {
  emailAddress: string;
  password: string;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, unknown>;
}

export interface SignInResponse {
  status: 'complete' | 'needs_first_factor' | 'needs_second_factor';
  createdSessionId?: string;
  firstFactorVerification?: {
    status: 'verified' | 'unverified';
    strategy: string;
  };
  secondFactorVerification?: {
    status: 'verified' | 'unverified';
    strategy: string;
  };
}

export interface SignUpResponse {
  status: 'complete' | 'needs_verification';
  createdUserId?: string;
  emailAddress?: string;
}

// Extend the LoadedClerk type with the methods we need
export interface ExtendedClerk {
  signOut: () => Promise<void>;
  client: {
    signIn: {
      create: (params: SignInParams) => Promise<SignInResponse>;
      attemptFirstFactor: (params: SignInParams) => Promise<SignInResponse>;
    };
    signUp: {
      create: (params: SignUpParams) => Promise<SignUpResponse>;
    };
  };
  authenticateWithRedirect: (params: {
    strategy: string;
    redirectUrl: string;
    redirectUrlComplete?: string;
  }) => Promise<void>;
}

export interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  metadata?: Record<string, unknown>;
}
