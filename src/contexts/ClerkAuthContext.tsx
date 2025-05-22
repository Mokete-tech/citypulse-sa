
import React, { createContext, useContext } from "react";
import { useUser, useSignIn, useSignUp } from "@clerk/clerk-react";

const ClerkAuthContext = createContext<any>(null);

export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // We're not wrapping with ClerkProvider here anymore since it's in main.tsx
  return children;
};

export const useClerkAuth = () => {
  const user = useUser();
  const signIn = useSignIn();
  const signUp = useSignUp();

  return { user, signIn, signUp };
};
