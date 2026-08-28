import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { fetchApi } from "../lib/api";
import { useRouter, useSegments } from "expo-router";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) {
          const profile = await fetchApi("/users/me");
          setUser(profile);
        }
      } catch (error) {
        console.warn("Session expired or invalid");
        await SecureStore.deleteItemAsync("access_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // In expo-router, the first segment tells us what group we are in
      // For instance, if segments[0] is "(auth)", we are in the public area.
      // If segments[0] is "(dashboard)", we are in the protected area.
      const inAuthGroup = segments[0] === "(auth)";
      const inDashboardGroup = segments[0] === "(dashboard)";

      if (!user && inDashboardGroup) {
        // Redirect to login if unauthenticated but trying to access dashboard
        router.replace("/(auth)/login");
      } else if (user && inAuthGroup) {
        // Redirect to dashboard if authenticated but trying to access auth screens
        router.replace("/(dashboard)");
      }
    }
  }, [user, isLoading, segments]);

  const login = async (token: string, userData: User) => {
    await SecureStore.setItemAsync("access_token", token);
    setUser(userData);
    router.replace("/(dashboard)");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setUser(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
