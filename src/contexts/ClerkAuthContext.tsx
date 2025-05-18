import React, { createContext, useContext } from "react";
import { ClerkProvider, useUser, useSignIn, useSignUp } from "@clerk/clerk-react";

const ClerkAuthContext = createContext<any>(null);

export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};

export const useClerkAuth = () => {
  const user = useUser();
  const signIn = useSignIn();
  const signUp = useSignUp();

  return { user, signIn, signUp };
};
