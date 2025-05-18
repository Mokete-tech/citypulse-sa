import React, { createContext, useContext } from "react";
import { ClerkProvider, useUser, useSignIn, useSignOut } from "@clerk/clerk-react";

const ClerkAuthContext = createContext<any>(null);

export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider frontendApi={import.meta.env.VITE_CLERK_FRONTEND_API}>
      {children}
    </ClerkProvider>
  );
};

export const useClerkAuth = () => {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return { user, signIn, signOut };
};
