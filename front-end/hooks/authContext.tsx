import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteAccessToken, getAccessToken, saveAccessToken } from "../libs/storage/token";
import { authCheck } from "../services/api/authCheckApi";

type AuthState = {
  accessToken: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// GLOBAL CONTAINER FOR THE ACCESS TOKEN
export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      if (!token) {
        setAccessToken(null);
        setIsLoading(false);
        return;
      }

      try {
        await authCheck();
        setAccessToken(token);
      } catch {
        await deleteAccessToken();
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string) => {
    await saveAccessToken(token);
    setAccessToken(token);
  };

  const signOut = async () => {
    await deleteAccessToken();
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, isLoading, signIn, signOut }}>
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
