"use client";
import { getProfile } from "@/services/auth-service";
import { IUser } from "@/types/auth-type";
import { createContext, useState, useContext, useEffect, PropsWithChildren } from "react";
import { toast } from "sonner";
import { setCookie, deleteCookie, getCookie } from "cookies-next/client";
import { setAxiosConfig } from "@/lib/axios-config";

interface Context {
  user: IUser | null;
  changeToken: (token?: string) => void;
  fetchProfile: () => void;
  isLoading: boolean;
}

const contextValue = {
  changeToken: () => {},
  user: null,
  fetchProfile: () => {},
  isLoading: false,
};

const AuthContext = createContext<Context>(contextValue);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromCookie = getCookie("token");

    if (!tokenFromCookie) return;
    setAxiosConfig(tokenFromCookie);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getProfile();
      setUser(result);
    } catch (error) {
      toast((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeToken = (token?: string) => {
    setAxiosConfig(token ?? "");
    if (token) {
      setCookie("token", token);
      fetchProfile();
    } else {
      deleteCookie("token");
      setUser(null);
    }
  };

  const AuthContextValue = {
    user,
    changeToken,
    fetchProfile,
    isLoading,
  };

  return <AuthContext.Provider value={AuthContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("ERROR, useToken must be used within TokenContext");
  }

  return context;
}
