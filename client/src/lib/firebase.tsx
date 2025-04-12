import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase (only if it hasn't been initialized already)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    app = getApp(); // Get the already initialized app
  } else {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}
const auth = getAuth(app);
const db = getFirestore(app);

interface User {
  id: string;
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "merchants", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              username: userData.username || "",
              merchantId: userData.merchantId || firebaseUser.uid,
              merchantName: userData.merchantName || ""
            });
          } else {
            // Create a new merchant document if it doesn't exist
            const newUserData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              username: firebaseUser.displayName || "",
              merchantId: firebaseUser.uid,
              merchantName: firebaseUser.displayName || "Merchant"
            };
            
            await setDoc(doc(db, "merchants", firebaseUser.uid), newUserData);
            setCurrentUser(newUserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "merchants", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: userData.username || "",
          merchantId: userData.merchantId || firebaseUser.uid,
          merchantName: userData.merchantName || ""
        };
      } else {
        // Create a new merchant document if it doesn't exist
        const newUserData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: firebaseUser.displayName || "",
          merchantId: firebaseUser.uid,
          merchantName: firebaseUser.displayName || "Merchant"
        };
        
        await setDoc(doc(db, "merchants", firebaseUser.uid), newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export Firebase services
export { auth, db };