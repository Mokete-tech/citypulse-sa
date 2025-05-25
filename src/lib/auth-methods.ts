import { toast } from "sonner";
import { AuthUser, AuthError, SignInParams, SignUpParams, SignInResponse, SignUpResponse } from '../contexts/AuthContextTypes';

// Types for Clerk methods
interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

interface ClerkClient {
  signIn: {
    create: (params: SignInParams) => Promise<SignInResponse>;
    attemptFirstFactor: (params: SignInParams) => Promise<SignInResponse>;
  };
  signUp: {
    create: (params: SignUpParams) => Promise<SignUpResponse>;
  };
}

interface Clerk {
  user: Promise<ClerkUser>;
  client: ClerkClient;
  signOut: () => Promise<void>;
}

interface ClerkInstance {
  signOut: () => Promise<void>;
  client: ClerkClient;
  authenticateWithRedirect: (params: {
    strategy: string;
    redirectUrl: string;
    redirectUrlComplete?: string;
  }) => Promise<void>;
}

interface AuthResponse {
  success: boolean;
  data?: SignInResponse | SignUpResponse;
  error?: string;
}

interface PhoneFactor {
  strategy: string;
  phoneNumberId: string;
}

// Email authentication methods
export const emailSignIn = async (clerk: ClerkInstance, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await clerk.client.signIn.create({
      identifier: email,
      password: password,
    });
    return { success: true, data: response };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Sign in error:", authError);
    toast.error("Sign in failed", {
      description: authError.message || "Invalid credentials. Please try again.",
    });
    throw authError;
  }
};

export const emailSignUp = async (
  clerk: ClerkInstance, 
  email: string, 
  password: string, 
  metadata?: Record<string, unknown>
): Promise<AuthResponse> => {
  try {
    const response = await clerk.client.signUp.create({
      emailAddress: email,
      password: password,
      unsafeMetadata: metadata || {},
    });
    return { success: true, data: response };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Sign up error:", authError);
    toast.error("Sign up failed", {
      description: authError.message || "Could not create account. Please try again.",
    });
    throw authError;
  }
};

// OAuth authentication methods
export const googleSignIn = async (clerk: ClerkInstance): Promise<AuthResponse> => {
  try {
    await clerk.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: '/auth/callback',
    });
    return { success: true };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Google sign in error:", authError);
    toast.error("Google sign in failed", {
      description: authError.message || "Could not sign in with Google. Please try again.",
    });
    throw authError;
  }
};

export const facebookSignIn = async (clerk: ClerkInstance): Promise<AuthResponse> => {
  try {
    await clerk.authenticateWithRedirect({
      strategy: "oauth_facebook",
      redirectUrl: '/auth/callback',
    });
    return { success: true };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Facebook sign in error:", authError);
    toast.error("Facebook sign in failed", {
      description: authError.message || "Could not sign in with Facebook. Please try again.",
    });
    throw authError;
  }
};

// Phone authentication methods
export const phoneSignIn = async (clerk: ClerkInstance, phone: string, verificationCode?: string): Promise<AuthResponse> => {
  try {
    if (verificationCode) {
      const response = await clerk.client.signIn.attemptFirstFactor({
        strategy: "phone_code",
        code: verificationCode,
      });
      return { success: true, data: response };
    }
    
    const response = await clerk.client.signIn.create({
      identifier: phone,
    });
    
    const phoneFactors = response.supportedFirstFactors.find(
      (factor: PhoneFactor) => factor.strategy === "phone_code"
    );
    
    if (phoneFactors) {
      await response.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId: phoneFactors.phoneNumberId,
      });
    }
    
    return { success: true, data: response };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Phone sign in error:", authError);
    toast.error("Phone sign in failed", {
      description: authError.message || "Could not sign in with phone. Please try again.",
    });
    throw authError;
  }
};

export const phoneSignUp = async (
  clerk: ClerkInstance, 
  phone: string, 
  metadata?: Record<string, unknown>
): Promise<AuthResponse> => {
  try {
    const response = await clerk.client.signUp.create({
      phoneNumber: phone,
      unsafeMetadata: metadata || {},
    });
    
    await response.prepareVerification({
      strategy: "phone_code",
    });
    
    return { success: true, data: response };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Phone sign up error:", authError);
    toast.error("Phone sign up failed", {
      description: authError.message || "Could not sign up with phone. Please try again.",
    });
    throw authError;
  }
};

export const verifyPhoneOtp = async (clerk: ClerkInstance, phone: string, code: string): Promise<AuthResponse> => {
  try {
    return await phoneSignIn(clerk, phone, code);
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("OTP verification error:", authError);
    toast.error("OTP verification failed", {
      description: authError.message || "Invalid verification code. Please try again.",
    });
    throw authError;
  }
};

export const sendPhoneVerification = async (clerk: ClerkInstance, phone: string): Promise<AuthResponse> => {
  try {
    await phoneSignIn(clerk, phone);
    return { success: true };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Send verification error:", authError);
    toast.error("Failed to send verification code", {
      description: authError.message || "Could not send verification code. Please try again.",
    });
    return { success: false, error: authError.message };
  }
};

// Password reset method
export const resetPassword = async (clerk: ClerkInstance, email: string): Promise<AuthResponse> => {
  try {
    await clerk.client.signIn.create({
      identifier: email,
    });
    
    toast.success("Password reset email sent", {
      description: `If an account exists with ${email}, you'll receive an email with reset instructions.`
    });
    return { success: true };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Password reset error:", authError);
    toast.error("Password reset failed", {
      description: authError.message || "Could not reset password. Please try again.",
    });
    return { success: false, error: authError.message };
  }
};

export const signOut = async (clerk: ClerkInstance): Promise<AuthResponse> => {
  try {
    await clerk.signOut();
    toast.success("Signed out successfully");
    return { success: true };
  } catch (error) {
    const authError = handleAuthError(error);
    console.error("Sign out error:", authError);
    toast.error("Sign out failed", {
      description: authError.message || "Could not sign out. Please try again.",
    });
    throw authError;
  }
};

export const handleAuthError = (error: unknown): AuthError => {
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

export const login = async (clerk: Clerk, email: string, password: string): Promise<AuthUser> => {
  try {
    const params: SignInParams = { identifier: email, password };
    const response: SignInResponse = await clerk.client.signIn.create(params);
    
    if (response.status === 'complete') {
      const user = await clerk.user;
      return {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        role: 'user',
      };
    }
    throw new Error('Authentication failed');
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const signup = async (
  clerk: Clerk,
  email: string,
  password: string,
  userData: Partial<AuthUser>
): Promise<AuthUser> => {
  try {
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
      return {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        role: userData.role || 'user',
      };
    }
    throw new Error('Registration failed');
  } catch (error) {
    throw handleAuthError(error);
  }
};
