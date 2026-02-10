"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

interface FavoritesContextType {
  items: FavoriteItem[];
  totalFavorites: number;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "shop-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FavoriteItem[];
        setItems(parsed);
      } catch {
        // Invalid stored data, ignore
      }
    }
    setHydrated(true);
  }, []);

  // Save favorites to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const isFavorite = useCallback(
    (productId: string) => {
      return items.some((i) => i.productId === productId);
    },
    [items]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.productId === item.productId)) {
          return prev.filter((i) => i.productId !== item.productId);
        }
        return [...prev, item];
      });
    },
    []
  );

  const clearFavorites = useCallback(() => {
    setItems([]);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        items,
        totalFavorites: items.length,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
