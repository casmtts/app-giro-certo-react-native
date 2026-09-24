import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type FavoritesContextValue = {
  favoriteIds: number[];
  ready: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const FAVORITES_KEY = "giro-certo-favorite-ids";

export function FavoritesProvider({ children }: React.PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(FAVORITES_KEY).then((saved) => {
      if (!active) return;
      setFavoriteIds(saved ? JSON.parse(saved) as number[] : []);
      setReady(true);
    }).catch(() => setReady(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || !token) return;
    let active = true;
    api.favorites(token).then(async (remoteFavorites) => {
      if (!active) return;
      const remoteIds = remoteFavorites.map((motorcycle) => motorcycle.id);
      const merged = Array.from(new Set([...remoteIds, ...favoriteIds]));
      setFavoriteIds(merged);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(merged));
      const remoteSet = new Set(remoteIds);
      await Promise.all(
        favoriteIds.filter((id) => !remoteSet.has(id)).map((id) => api.addFavorite(token, id).catch(() => undefined))
      );
    }).catch(() => undefined);
    return () => { active = false; };
  }, [token, ready]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((current) => {
      const remove = current.includes(id);
      const next = remove ? current.filter((favoriteId) => favoriteId !== id) : [...current, id];
      void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      if (token) {
        const update = remove ? api.removeFavorite(token, id) : api.addFavorite(token, id);
        void update.catch(() => undefined);
      }
      return next;
    });
  }, [token]);

  const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);
  const value = useMemo(() => ({ favoriteIds, ready, isFavorite, toggleFavorite }), [favoriteIds, ready, isFavorite, toggleFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider.");
  return value;
}
