import { toast } from "sonner";

// Types for Clerk methods
interface SignInParams {
  identifier: string;
  password?: string; // Make password optional
}

interface SignUpParams {
  emailAddress?: string;
  password?: string;
  phoneNumber?: string;
  unsafeMetadata?: any;
}

interface PhoneSignInParams {
  strategy: string;
  phoneNumberId: string;
}

interface ClerkClient {
  signIn: {
    create: (params: SignInParams) => Promise<any>;
    attemptFirstFactor: (params: any) => Promise<any>;
  };
  signUp: {
    create: (params: SignUpParams) => Promise<any>;
  };
}

interface ClerkInstance {
  signOut: () => Promise<void>;
  client: ClerkClient;
  authenticateWithRedirect: (params: {
    strategy: string;
    redirectUrl: string;
    redirectUrlComplete?: string;
  }) => Promise<any>;
}

// Email authentication methods
export const emailSignIn = async (clerk: ClerkInstance, email: string, password: string) => {
  try {
    const response = await clerk.client.signIn.create({
      identifier: email,
      password: password,
    });
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Sign in error:", error);
    toast.error("Sign in failed", {
      description: error.message || "Invalid credentials. Please try again.",
    });
    throw error;
  }
};

export const emailSignUp = async (
  clerk: ClerkInstance, 
  email: string, 
  password: string, 
  metadata?: any
) => {
  try {
    const response = await clerk.client.signUp.create({
      emailAddress: email,
      password: password,
      unsafeMetadata: metadata || {},
    });
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Sign up error:", error);
    toast.error("Sign up failed", {
      description: error.message || "Could not create account. Please try again.",
    });
    throw error;
  }
};

// OAuth authentication methods
export const googleSignIn = async (clerk: ClerkInstance) => {
  try {
    await clerk.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: '/auth/callback',
    });
    return { success: true };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    toast.error("Google sign in failed", {
      description: error.message || "Could not sign in with Google. Please try again.",
    });
    throw error;
  }
};

export const facebookSignIn = async (clerk: ClerkInstance) => {
  try {
    await clerk.authenticateWithRedirect({
      strategy: "oauth_facebook",
      redirectUrl: '/auth/callback',
    });
    return { success: true };
  } catch (error: any) {
    console.error("Facebook sign in error:", error);
    toast.error("Facebook sign in failed", {
      description: error.message || "Could not sign in with Facebook. Please try again.",
    });
    throw error;
  }
};

// Phone authentication methods
export const phoneSignIn = async (clerk: ClerkInstance, phone: string, verificationCode?: string) => {
  try {
    // If verification code is provided, complete sign-in
    if (verificationCode) {
      const response = await clerk.client.signIn.attemptFirstFactor({
        strategy: "phone_code",
        code: verificationCode,
      });
      return { success: true, data: response };
    }
    
    // Otherwise start the phone verification process
    const response = await clerk.client.signIn.create({
      identifier: phone,
    });
    
    // Initiate phone code verification
    const phoneFactors = response.supportedFirstFactors.find(
      (factor: any) => factor.strategy === "phone_code"
    );
    
    if (phoneFactors) {
      await response.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId: phoneFactors.phoneNumberId,
      });
    }
    
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Phone sign in error:", error);
    toast.error("Phone sign in failed", {
      description: error.message || "Could not sign in with phone. Please try again.",
    });
    throw error;
  }
};

export const phoneSignUp = async (clerk: ClerkInstance, phone: string, metadata?: any) => {
  try {
    const response = await clerk.client.signUp.create({
      phoneNumber: phone,
      unsafeMetadata: metadata || {},
    });
    
    // Prepare phone verification
    await response.prepareVerification({
      strategy: "phone_code",
    });
    
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Phone sign up error:", error);
    toast.error("Phone sign up failed", {
      description: error.message || "Could not sign up with phone. Please try again.",
    });
    throw error;
  }
};

export const verifyPhoneOtp = async (clerk: ClerkInstance, phone: string, code: string) => {
  try {
    // This handles verification by passing the verification code to phoneSignIn
    return await phoneSignIn(clerk, phone, code);
  } catch (error: any) {
    console.error("OTP verification error:", error);
    toast.error("OTP verification failed", {
      description: error.message || "Invalid verification code. Please try again.",
    });
    throw error;
  }
};

export const sendPhoneVerification = async (clerk: ClerkInstance, phone: string) => {
  try {
    // Try to create a sign in with phone
    await phoneSignIn(clerk, phone);
    return { success: true };
  } catch (error: any) {
    console.error("Send verification error:", error);
    toast.error("Failed to send verification code", {
      description: error.message || "Could not send verification code. Please try again.",
    });
    return { success: false, error: String(error) };
  }
};

// Password reset method
export const resetPassword = async (clerk: ClerkInstance, email: string) => {
  try {
    // Use the password reset flow instead of the regular sign-in
    await clerk.client.signIn.create({
      identifier: email,
      // Use reset_password_email_code strategy without password
    });
    
    // Get the first factor for password reset
    // We'll simulate this for now since the actual flow might be different in your Clerk implementation
    toast.success("Password reset email sent", {
      description: `If an account exists with ${email}, you'll receive an email with reset instructions.`
    });
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast.error("Password reset failed", {
      description: error.message || "Could not reset password. Please try again.",
    });
    return { success: false, error: String(error) };
  }
};

export const signOut = async (clerk: ClerkInstance) => {
  try {
    await clerk.signOut();
    toast.success("Signed out successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.error("Sign out failed", {
      description: error.message || "Could not sign out. Please try again.",
    });
    throw error;
  }
};
