import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  foodId: string;
  size: string;
  qty: number;
  unitPrice: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Total number of dishes (sum of quantities). */
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  setQty: (foodId: string, size: string, qty: number) => void;
  removeItem: (foodId: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** In-memory cart. Swap for persisted / server state later. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((list) => {
      const existing = list.find(
        (i) => i.foodId === item.foodId && i.size === item.size,
      );
      if (!existing) return [...list, item];
      return list.map((i) =>
        i === existing ? { ...i, qty: i.qty + item.qty } : i,
      );
    });
  }, []);

  const setQty = useCallback(
    (foodId: string, size: string, qty: number) =>
      setItems((list) =>
        list.map((i) =>
          i.foodId === foodId && i.size === size
            ? { ...i, qty: Math.max(1, qty) }
            : i,
        ),
      ),
    [],
  );

  const removeItem = useCallback(
    (foodId: string, size: string) =>
      setItems((list) =>
        list.filter((i) => !(i.foodId === foodId && i.size === size)),
      ),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [items, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
