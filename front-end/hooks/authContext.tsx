import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteAccessToken, getAccessToken, saveAccessToken } from "../libs/storage/token";
import { authCheckApi } from "../services/api/authCheckApi";

export type AuthUser = {
  id: number;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// GLOBAL CONTAINER FOR THE ACCESS TOKEN
export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      if (!token) {
        setAccessToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await authCheckApi();
        setAccessToken(token);
        setUser(res.user);
      } catch {
        await deleteAccessToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string) => {
    await saveAccessToken(token);
    const res = await authCheckApi();
    setAccessToken(token);
    setUser(res.user);
  };

  const signOut = async () => {
    await deleteAccessToken();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// PREVENTS BUGS
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
