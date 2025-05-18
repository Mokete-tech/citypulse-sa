import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../integrations/supabase/client";

const AuthContext = createContext<{ user: any }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    return () => { authListener?.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
