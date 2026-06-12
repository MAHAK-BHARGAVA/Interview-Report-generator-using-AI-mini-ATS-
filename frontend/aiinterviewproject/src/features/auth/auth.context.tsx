import { createContext, useState,useEffect} from 'react';
import type { ReactNode } from 'react';
import {getCurrentUser} from './services/auth.api';
interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// ✅ give default value
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
    const getandSetUser = async () => {
      try {
        const userData = await getCurrentUser();
        console.log("=== REFRESH DATA RECEIVED ===", userData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch initial session context:", error);
        setUser(null);
      } finally {
        setLoading(false); // Safeguard execution
      }
    };

    // ✅ EXECUTE THE FUNCTION HERE!
    getandSetUser();
  }, []); // ✅ empty dependency array to run only once on mount
  
  return (
    // ✅ use ()
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};