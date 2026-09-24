import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { AuthResponse, UpdateProfileInput, UserProfile } from "@/lib/types";

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  ready: boolean;
  setSession: (session: AuthResponse) => Promise<void>;
  updateProfile: (profile: UpdateProfileInput) => Promise<UserProfile>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "giro-certo-session-token";

// Expo SecureStore is native-only. Keep web preview tokens in memory instead
// of persisting them in browser storage, where JavaScript could read them.
const webTokens = new Map<string, string>();
const readToken = (key: string) => Platform.OS === "web"
  ? Promise.resolve(webTokens.get(key) ?? null)
  : SecureStore.getItemAsync(key);
const writeToken = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    webTokens.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};
const removeToken = async (key: string) => {
  if (Platform.OS === "web") {
    webTokens.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    readToken(TOKEN_KEY).then(async (storedToken) => {
      if (!active) return;
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await api.currentUser(storedToken);
          if (active) setUser(profile);
        } catch {
          // Keep a stored token when the API is temporarily unreachable.
        }
      }
      if (active) setReady(true);
    }).catch(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  const setSession = useCallback(async (session: AuthResponse) => {
    await writeToken(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const updateProfile = useCallback(async (profile: UpdateProfileInput) => {
    if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
    const updatedUser = await api.updateProfile(token, profile);
    setUser(updatedUser);
    return updatedUser;
  }, [token]);

  const signOut = useCallback(async () => {
    await removeToken(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, ready, setSession, updateProfile, signOut }), [token, user, ready, setSession, updateProfile, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return value;
}
