import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { apiRequest } from "./queryClient";

// Auth types
interface User {
  id: number;
  email: string;
  username: string;
  merchantId: string;
  merchantName: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check local storage for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('citypulse_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('citypulse_user');
      }
    }
    setLoading(false);
  }, []);
  
  // Sign in function using our API and Firebase
  const signIn = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      // First authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Then authenticate with our backend
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const userData: User = await response.json();
      
      // Save user to state and local storage
      setCurrentUser(userData);
      localStorage.setItem('citypulse_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      
      // Clear user from state and local storage
      setCurrentUser(null);
      localStorage.removeItem('citypulse_user');
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    signIn,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}