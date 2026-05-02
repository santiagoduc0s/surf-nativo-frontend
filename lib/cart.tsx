"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

export type CartItem = {
  // mirrored product fields (snapshot at add-time)
  productId: number;
  slug: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  image: string;
  // line-specific
  size: string;
  color: string;
  qty: number;
  lineId: string;
};

type CartCtx = {
  items: CartItem[];
  add: (p: Product, opts: { size: string; color: string; qty: number }) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Cart = createContext<CartCtx | null>(null);

const KEY = "sn-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback<CartCtx["add"]>((p, opts) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === p.id && i.size === opts.size && i.color === opts.color,
      );
      if (existing) {
        return prev.map((i) =>
          i.lineId === existing.lineId ? { ...i, qty: i.qty + opts.qty } : i,
        );
      }
      const item: CartItem = {
        productId: p.id,
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        price: p.price,
        currency: p.currency,
        image: p.image,
        size: opts.size,
        color: opts.color,
        qty: opts.qty,
        lineId: `${p.id}-${opts.size}-${opts.color}-${Date.now()}`,
      };
      return [...prev, item];
    });
  }, []);

  const remove = useCallback<CartCtx["remove"]>((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const setQty = useCallback<CartCtx["setQty"]>((lineId, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { items, add, remove, setQty, clear, count, subtotal };
  }, [items, add, remove, setQty, clear]);

  return <Cart.Provider value={value}>{children}</Cart.Provider>;
}

export function useCart() {
  const ctx = useContext(Cart);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
