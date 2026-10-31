"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, isPurchasable, type Product } from "@/lib/products";

// One licence per product, so the cart is a set of product slugs.
type CartCtx = {
  items: Product[];
  count: number;
  total: number;
  ready: boolean;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs((JSON.parse(raw) as string[]).filter((s) => getProduct(s)));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs, ready]);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);

  const add = useCallback((slug: string) => {
    const p = getProduct(slug);
    if (!p || !isPurchasable(p)) return;
    setSlugs((s) => (s.includes(slug) ? s : [...s, slug]));
    setMsg(`${p.name} 已加入购物车`);
  }, []);

  const value = useMemo<CartCtx>(() => {
    const items = slugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);
    return {
      items,
      count: items.length,
      total: items.reduce((n, p) => n + (p.price ?? 0), 0),
      ready,
      has: (s) => slugs.includes(s),
      add,
      remove: (s) => setSlugs((x) => x.filter((y) => y !== s)),
      clear: () => setSlugs([]),
      toast: setMsg,
    };
  }, [slugs, ready, add]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`toast${msg ? " show" : ""}`} role="status" aria-live="polite">
        {msg}
      </div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
