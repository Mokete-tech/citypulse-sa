import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

// Define the type for our context
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

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Extend the LoadedClerk type with the methods we need
interface ExtendedClerk {
  signOut: () => Promise<void>;
  // Add the methods that are missing in the LoadedClerk type
  client: {
    signIn: {
      create: (params: any) => Promise<any>;
      attemptFirstFactor: (params: any) => Promise<any>;
    };
    signUp: {
      create: (params: any) => Promise<any>;
    };
  };
}

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const clerk = useClerk() as unknown as ExtendedClerk;
  const { user: clerkUser, isLoaded } = useUser();
  
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
  }, [isLoaded, clerkUser]);
  
  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const response = await clerk.client.signIn.create({
        identifier: email,
        password: password,
      });
      return response;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    return signIn(email, password);
  };
  
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const response = await clerk.client.signUp.create({
        emailAddress: email,
        password: password,
        unsafeMetadata: metadata || {},
      });
      return response;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      // For OAuth in newer Clerk versions
      clerk.openSignIn({
        redirectUrl: '/auth/callback',
        appearance: {
          elements: {
            rootBox: 'w-full',
          },
        },
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };
  
  const signInWithFacebook = async () => {
    try {
      // For OAuth in newer Clerk versions
      clerk.openSignIn({
        redirectUrl: '/auth/callback',
        appearance: {
          elements: {
            rootBox: 'w-full',
          },
        },
      });
    } catch (error) {
      console.error("Facebook sign in error:", error);
      throw error;
    }
  };
  
  const signInWithPhone = async (phone: string, verificationCode?: string) => {
    try {
      // If verification code is provided, complete sign-in
      if (verificationCode) {
        // This assumes a previous signIn.create call was made to initiate phone verification
        const response = await clerk.client.signIn.attemptFirstFactor({
          strategy: "phone_code",
          code: verificationCode,
        });
        return response;
      }
      
      // Otherwise start the phone verification process
      const response = await clerk.client.signIn.create({
        identifier: phone,
      });
      
      // Initiate phone code verification
      await response.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId: response.supportedFirstFactors.find(
          (factor: any) => factor.strategy === "phone_code"
        )?.phoneNumberId,
      });
      
      return response;
    } catch (error) {
      console.error("Phone sign in error:", error);
      throw error;
    }
  };
  
  const verifyPhoneOtp = async (phone: string, code: string) => {
    try {
      // This is simplified; in a real implementation you would need to
      // track the sign-in attempt ID from the initial signInWithPhone call
      return signInWithPhone(phone, code);
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };
  
  const signUpWithPhone = async (phone: string, metadata?: any) => {
    try {
      const response = await clerk.client.signUp.create({
        phoneNumber: phone,
        unsafeMetadata: metadata || {},
      });
      
      // Prepare phone verification
      await response.prepareVerification({
        strategy: "phone_code",
      });
      
      return response;
    } catch (error) {
      console.error("Phone sign up error:", error);
      throw error;
    }
  };
  
  const sendPhoneVerification = async (phone: string) => {
    try {
      // Try to create a sign in with phone
      await signInWithPhone(phone);
      return { success: true };
    } catch (error) {
      console.error("Send verification error:", error);
      return { success: false, error: String(error) };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // This is a simple implementation - in a real app, you would use Clerk's password reset flow
      await clerk.client.signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: String(error) };
    }
  };
  
  const handleSignOut = async () => {
    try {
      await clerk.signOut();
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
      signInWithEmail,
      verifyPhoneOtp,
      signUpWithPhone,
      sendPhoneVerification,
      resetPassword
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
