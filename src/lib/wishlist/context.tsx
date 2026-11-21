"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { WishlistItem, WishlistContextType } from "./types";

const WISHLIST_STORAGE_KEY = "rtds_wishlist_v1";

const emptySubscribe = () => () => {};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parse error
    }
    return [];
  });

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage error
    }
  }, [items, isLoaded]);

  const toggleWishlist = (newItem: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.bookId === newItem.bookId);
      if (exists) {
        return prev.filter((item) => item.bookId !== newItem.bookId);
      } else {
        return [
          {
            ...newItem,
            addedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const removeItem = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const isWishlisted = (bookId: string) => {
    return items.some((item) => item.bookId === bookId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        removeItem,
        isWishlisted,
        clearWishlist,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
