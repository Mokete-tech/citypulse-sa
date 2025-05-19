import React, { createContext, useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { 
  emailSignIn, 
  emailSignUp, 
  googleSignIn, 
  facebookSignIn, 
  phoneSignIn, 
  phoneSignUp, 
  verifyPhoneOtp as verifyOtp,
  sendPhoneVerification as sendVerification,
  resetPassword as resetPwd,
  signOut as logout
} from '../lib/auth-methods';
import { AuthContextType, ExtendedClerk } from './AuthContextTypes';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

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
  
  // Auth methods using our utility functions
  const signIn = async (email: string, password: string) => {
    return await emailSignIn(clerk, email, password);
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    return await emailSignIn(clerk, email, password);
  };
  
  const signUp = async (email: string, password: string, metadata?: any) => {
    return await emailSignUp(clerk, email, password, metadata);
  };
  
  const signInWithGoogle = async () => {
    return await googleSignIn(clerk);
  };
  
  const signInWithFacebook = async () => {
    return await facebookSignIn(clerk);
  };
  
  const signInWithPhone = async (phone: string, verificationCode?: string) => {
    return await phoneSignIn(clerk, phone, verificationCode);
  };
  
  const verifyPhoneOtp = async (phone: string, code: string) => {
    return await verifyOtp(clerk, phone, code);
  };
  
  const signUpWithPhone = async (phone: string, metadata?: any) => {
    return await phoneSignUp(clerk, phone, metadata);
  };
  
  const sendPhoneVerification = async (phone: string) => {
    return await sendVerification(clerk, phone);
  };

  const resetPassword = async (email: string) => {
    return await resetPwd(clerk, email);
  };
  
  const handleSignOut = async () => {
    try {
      await logout(clerk);
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

// Export the context and provider
export { AuthContext, useAuth };
export default AuthProvider;
