"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { CartItem, CartContextType, CartCalculations, VendorCartGroup } from "./types";

const CART_STORAGE_KEY = "rtds_cart_v1";
const FREE_SHIPPING_THRESHOLD_MINOR = 100000; // ৳ 1,000.00
const DEFAULT_VENDOR_SHIPPING_MINOR = 7000; // ৳ 70.00

const emptySubscribe = () => () => {};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  });

  // Save to localStorage whenever items change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<CartItem, "qty">, qty: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.bookId === newItem.bookId);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const nextQty = Math.min(existing.stock, existing.qty + qty);
        const updated = [...prev];
        updated[existingIndex] = { ...existing, qty: nextQty };
        return updated;
      } else {
        const initialQty = Math.min(newItem.stock, Math.max(1, qty));
        return [...prev, { ...newItem, qty: initialQty }];
      }
    });
  };

  const removeItem = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const updateQuantity = (bookId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item.bookId !== bookId);
      }
      return prev.map((item) => {
        if (item.bookId === bookId) {
          const validQty = Math.min(item.stock, Math.max(1, qty));
          return { ...item, qty: validQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItem = (bookId: string) => {
    return items.find((item) => item.bookId === bookId);
  };

  // Compute multi-vendor groups and financial totals
  const calculations: CartCalculations = useMemo(() => {
    const groupsMap = new Map<string, VendorCartGroup>();
    let subtotalMinor = 0;
    let itemsCount = 0;

    items.forEach((item) => {
      itemsCount += item.qty;
      const itemTotal = item.priceMinor * item.qty;
      subtotalMinor += itemTotal;

      if (!groupsMap.has(item.vendorId)) {
        groupsMap.set(item.vendorId, {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          vendorSlug: item.vendorSlug,
          shippingFeeMinor: item.shippingFeeMinor ?? DEFAULT_VENDOR_SHIPPING_MINOR,
          items: [],
          subtotalMinor: 0,
        });
      }

      const group = groupsMap.get(item.vendorId)!;
      group.items.push(item);
      group.subtotalMinor += itemTotal;
    });

    const groups = Array.from(groupsMap.values());
    const isFreeShipping = subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR;

    // Sum vendor shipping fees (once per unique vendor) unless free shipping qualifies
    const rawShippingTotal = groups.reduce((acc, g) => acc + g.shippingFeeMinor, 0);
    const shippingTotalMinor = isFreeShipping || items.length === 0 ? 0 : rawShippingTotal;
    const totalMinor = subtotalMinor + shippingTotalMinor;
    const freeShippingRemainingMinor = Math.max(
      0,
      FREE_SHIPPING_THRESHOLD_MINOR - subtotalMinor
    );

    return {
      itemsCount,
      subtotalMinor,
      shippingTotalMinor,
      totalMinor,
      isFreeShipping,
      freeShippingRemainingMinor,
      groups,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItem,
        calculations,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
