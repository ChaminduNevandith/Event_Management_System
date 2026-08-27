"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await fetchApi("/users/me");
          setUser(profile);
        } catch (error) {
          // Change to console.warn to prevent Next.js Turbopack from capturing it as a fatal error overlay
          console.warn("Session expired or invalid");
          localStorage.removeItem("access_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
      const isPublicPage = pathname === "/" || isAuthPage;

      if (!user && !isPublicPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        router.push("/trips");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
    router.push("/trips");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/");
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
