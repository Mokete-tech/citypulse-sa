
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';

// Define the type for our context
export interface AuthContextType {
  user: any; // This could be more specific if you know the structure
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  signInWithPhone: (phone: string, verificationCode?: string) => Promise<any>;
  verifyPhoneOtp: (phone: string, code: string) => Promise<any>;
  signUpWithPhone: (phone: string, metadata?: any) => Promise<any>;
  sendPhoneVerification: (phone: string) => Promise<{success: boolean, error?: string}>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const { isLoaded, isSignedIn, user: clerkUser, signOut: clerkSignOut } = useClerk();
  
  useEffect(() => {
    if (isLoaded) {
      setUser(clerkUser);
      setLoading(false);
      
      // Extract role from user metadata if available
      if (clerkUser) {
        const role = clerkUser.publicMetadata?.role as string || 'user';
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser]);
  
  // Auth methods (these would be implemented with actual functionality)
  const signIn = async (email: string, password: string) => {
    // Implement sign in logic
    console.log("Sign in with:", email, password);
    return Promise.resolve();
  };
  
  const signUp = async (email: string, password: string) => {
    // Implement sign up logic
    console.log("Sign up with:", email, password);
    return Promise.resolve();
  };
  
  const signInWithGoogle = async () => {
    // Implement Google sign in
    console.log("Sign in with Google");
    return Promise.resolve();
  };
  
  const signInWithFacebook = async () => {
    // Implement Facebook sign in
    console.log("Sign in with Facebook");
    return Promise.resolve();
  };
  
  const signInWithPhone = async (phone: string, verificationCode?: string) => {
    // Implement phone sign in
    console.log("Sign in with phone:", phone, verificationCode);
    return Promise.resolve();
  };
  
  const verifyPhoneOtp = async (phone: string, code: string) => {
    // Implement OTP verification
    console.log("Verify OTP:", phone, code);
    return Promise.resolve();
  };
  
  const signUpWithPhone = async (phone: string, metadata?: any) => {
    // Implement phone sign up
    console.log("Sign up with phone:", phone, metadata);
    return Promise.resolve();
  };
  
  const sendPhoneVerification = async (phone: string) => {
    // Implement sending verification code
    console.log("Send verification to:", phone);
    return { success: true };
  };
  
  const handleSignOut = async () => {
    try {
      await clerkSignOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      isAdmin: userRole === 'admin',
      isMerchant: userRole === 'merchant',
      signIn,
      signUp,
      signOut: handleSignOut,
      signInWithGoogle,
      signInWithFacebook,
      signInWithPhone,
      verifyPhoneOtp,
      signUpWithPhone,
      sendPhoneVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the default provider
export default AuthProvider;
