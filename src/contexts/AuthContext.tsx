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
import { toast } from '@/components/ui/sonner';

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  
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
        
        // Get session
        clerk.session?.getToken().then(token => {
          if (token) {
            setSession({ token });
          }
        }).catch(err => {
          console.error('Session error:', err);
          toast.error('Session error', {
            description: 'Failed to get session. Please try logging in again.'
          });
        });
      } else {
        setUserRole(null);
        setSession(null);
      }
    }
  }, [isLoaded, clerkUser, clerk.session]);
  
  // Auth methods using our utility functions
  const signIn = async (email: string, password: string) => {
    try {
      const result = await emailSignIn(clerk, email, password);
      if (result.success) {
        toast.success('Signed in successfully');
      }
      return result;
    } catch (error: any) {
      toast.error('Sign in failed', {
        description: error.message || 'Invalid credentials'
      });
      throw error;
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    return await emailSignIn(clerk, email, password);
  };
  
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const result = await emailSignUp(clerk, email, password, metadata);
      if (result.success) {
        toast.success('Account created successfully');
      }
      return result;
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message || 'Could not create account'
      });
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const result = await googleSignIn(clerk);
      if (result.success) {
        toast.success('Signed in with Google');
      }
      return result;
    } catch (error: any) {
      toast.error('Google sign in failed', {
        description: error.message || 'Could not sign in with Google'
      });
      throw error;
    }
  };
  
  const signInWithFacebook = async () => {
    try {
      const result = await facebookSignIn(clerk);
      if (result.success) {
        toast.success('Signed in with Facebook');
      }
      return result;
    } catch (error: any) {
      toast.error('Facebook sign in failed', {
        description: error.message || 'Could not sign in with Facebook'
      });
      throw error;
    }
  };
  
  const signInWithPhone = async (phone: string, verificationCode?: string) => {
    try {
      const result = await phoneSignIn(clerk, phone, verificationCode);
      if (result.success) {
        toast.success('Phone verification successful');
      }
      return result;
    } catch (error: any) {
      toast.error('Phone sign in failed', {
        description: error.message || 'Could not verify phone number'
      });
      throw error;
    }
  };
  
  const verifyPhoneOtp = async (phone: string, code: string) => {
    try {
      const result = await verifyOtp(clerk, phone, code);
      if (result.success) {
        toast.success('Phone number verified');
      }
      return result;
    } catch (error: any) {
      toast.error('Phone verification failed', {
        description: error.message || 'Could not verify code'
      });
      throw error;
    }
  };
  
  const signUpWithPhone = async (phone: string, metadata?: any) => {
    try {
      const result = await phoneSignUp(clerk, phone, metadata);
      if (result.success) {
        toast.success('Account created successfully');
      }
      return result;
    } catch (error: any) {
      toast.error('Phone sign up failed', {
        description: error.message || 'Could not create account'
      });
      throw error;
    }
  };
  
  const sendPhoneVerification = async (phone: string) => {
    try {
      const result = await sendVerification(clerk, phone);
      if (result.success) {
        toast.success('Verification code sent');
      }
      return result;
    } catch (error: any) {
      toast.error('Failed to send verification code', {
        description: error.message || 'Could not send code'
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await resetPwd(clerk, email);
      if (result.success) {
        toast.success('Password reset email sent');
      }
      return result;
    } catch (error: any) {
      toast.error('Password reset failed', {
        description: error.message || 'Could not send reset email'
      });
      throw error;
    }
  };
  
  const handleSignOut = async () => {
    try {
      await logout(clerk);
      setUser(null);
      setUserRole(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error('Sign out failed', {
        description: error.message || 'Could not sign out'
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      session,
      isAdmin: userRole === 'admin',
      isMerchant: userRole === 'merchant',
      signIn,
      signUp,
      signOut: handleSignOut,
      signInWithGoogle,
      signInWithFacebook,
      signInWithPhone,
      signInWithEmail: signIn,
      verifyPhoneOtp,
      signUpWithPhone,
      sendPhoneVerification,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context
export { AuthContext };

// Export the useAuth hook
import { useAuth } from '../hooks/useAuth';
export { useAuth };
export default AuthProvider;
