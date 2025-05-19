
export interface AuthContextType {
  user: any; // This could be more specific if you know the structure
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  signInWithPhone: (phone: string, verificationCode?: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  verifyPhoneOtp: (phone: string, code: string) => Promise<any>;
  signUpWithPhone: (phone: string, metadata?: any) => Promise<any>;
  sendPhoneVerification: (phone: string) => Promise<{success: boolean, error?: string}>;
  resetPassword: (email: string) => Promise<{success: boolean, error?: string}>;
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
