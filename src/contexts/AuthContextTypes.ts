export interface AuthContextType {
  user: any;
  loading: boolean;
  userRole: string | null;
  session: any;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
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
