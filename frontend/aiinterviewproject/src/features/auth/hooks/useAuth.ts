import { AuthContext } from "../auth.context";
import { useContext } from "react";
import {login, register ,logout} from "../services/auth.api";

// ✅ define types
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;

  // const handleLogin = async ({email, password}: LoginPayload) => {
  //   setLoading(true);
  //   try {
  //     const response = await login({email, password});
  //     if (response.token) {
  //       localStorage.setItem('token', response.token);
  //     }
  //     setUser(response.user);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleLogin = async ({ email, password }: LoginPayload) => {
  setLoading(true);
  try {
    const dataReceived = await login({ email, password });
    
    // 1. Check your console log when you click login to see the exact structure!
    console.log("=== RAW DATA RECEIVED FROM LOGIN API ===", dataReceived);

    // 2. Extract the token depending on how your backend structures the object
    const token = dataReceived?.token || dataReceived?.data?.token;
    const userProfile = dataReceived?.user || dataReceived?.data?.user;

    if (token) {
      // ✅ THIS IS THE CRITICAL LINE: This writes the token to your browser's disk memory
      localStorage.setItem('token', token); 
      console.log("Token successfully written to localStorage!");
    } else {
      console.warn("Could not find a token in the backend response. Check the console log above.");
    }

    setUser(userProfile);
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async ({name, email, password}: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await register({name, email, password});
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
    } catch (error) {
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }
  return { user, loading, handleLogin, handleRegister, handleLogout }
}