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

export type CartLine = {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  href: string;
  selectedSpecs?: string;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (slug: string, selectedSpecs?: string) => void;
  setQuantity: (slug: string, quantity: number, selectedSpecs?: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "rog_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(line: CartLine, slug: string, selectedSpecs?: string) {
  return line.slug === slug && (line.selectedSpecs ?? "") === (selectedSpecs ?? "");
}

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line): line is CartLine =>
          Boolean(line) &&
          typeof line.slug === "string" &&
          typeof line.name === "string" &&
          typeof line.price === "number" &&
          typeof line.quantity === "number"
      )
      .map((line) => ({
        ...line,
        quantity: Math.max(1, Math.min(10, Math.round(line.quantity))),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLines(readStorage());
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // localStorage đầy hoặc bị chặn — bỏ qua, giỏ hàng vẫn dùng được trong phiên.
    }
  }, [lines, ready]);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((item) =>
        sameLine(item, line.slug, line.selectedSpecs)
      );
      if (existing) {
        return prev.map((item) =>
          sameLine(item, line.slug, line.selectedSpecs)
            ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { ...line, quantity: Math.max(1, Math.min(10, quantity)) }];
    });
  }, []);

  const removeLine = useCallback((slug: string, selectedSpecs?: string) => {
    setLines((prev) => prev.filter((item) => !sameLine(item, slug, selectedSpecs)));
  }, []);

  const setQuantity = useCallback(
    (slug: string, quantity: number, selectedSpecs?: string) => {
      if (quantity <= 0) {
        removeLine(slug, selectedSpecs);
        return;
      }
      setLines((prev) =>
        prev.map((item) =>
          sameLine(item, slug, selectedSpecs)
            ? { ...item, quantity: Math.min(10, Math.round(quantity)) }
            : item
        )
      );
    },
    [removeLine]
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    return { lines, count, subtotal, ready, addLine, removeLine, setQuantity, clear };
  }, [lines, ready, addLine, removeLine, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart phải được dùng bên trong <CartProvider>.");
  }
  return ctx;
}

/** "134.990.000 ₫" -> 134990000 */
export function parseVnd(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatVnd(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")} ₫`;
}
