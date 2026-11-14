import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Order, OrderLine, seedOrders } from "@/assets/data/food";
import { useAccount } from "@/context/AccountContext";

/**
 * Demo only: a "live" order advances one stage (placed → preparing → on the
 * way → delivered) every STAGE_MS. A real backend would push these updates.
 */
export const STAGE_MS = 15000;

type PlaceMeta = { address?: string; payment?: string };

type OrdersContextValue = {
  orders: Order[];
  getOrder: (id?: string) => Order | undefined;
  placeOrder: (lines: OrderLine[], meta?: PlaceMeta) => Order;
  cancelOrder: (id: string) => void;
  /** Starts the demo progress simulation for an order. */
  startTracking: (id: string) => void;
  /** Removes canceled orders from the history. */
  clearCanceled: () => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

/** In-memory orders, seeded from the dummy JSON. Swap for an API later. */
export function OrdersProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useAccount();
  const [orders, setOrders] = useState<Order[]>(() =>
    seedOrders.map((o) => ({ ...o, stageAt: Date.now() })),
  );
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delivered: Order[] = [];
      let changed = false;

      const next = ordersRef.current.map((o) => {
        if (!o.live || o.status !== "ongoing") return o;
        if (now - (o.stageAt ?? now) < STAGE_MS) return o;
        changed = true;
        const stage = o.stage + 1;
        if (stage >= 3) {
          const done: Order = { ...o, stage: 3, status: "completed", stageAt: now };
          delivered.push(done);
          return done;
        }
        return { ...o, stage, stageAt: now };
      });

      if (!changed) return;
      setOrders(next);
      delivered.forEach((o) =>
        addNotification({
          type: "delivery",
          title: "Order delivered",
          body: `Order #${o.id} was delivered. Enjoy your meal — and rate it!`,
        }),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [addNotification]);

  const placeOrder = useCallback((lines: OrderLine[], meta?: PlaceMeta) => {
    const order: Order = {
      id: String(100000 + Math.floor(Math.random() * 900000)),
      status: "ongoing",
      createdAt: new Date().toISOString(),
      lines,
      stage: 0,
      stageAt: Date.now(),
      live: true,
      ...meta,
    };
    setOrders((list) => [order, ...list]);
    return order;
  }, []);

  const cancelOrder = useCallback(
    (id: string) =>
      setOrders((list) =>
        list.map((o) =>
          o.id === id ? { ...o, status: "canceled", live: false } : o,
        ),
      ),
    [],
  );

  const startTracking = useCallback(
    (id: string) =>
      setOrders((list) =>
        list.map((o) =>
          o.id === id && o.status === "ongoing" && !o.live
            ? { ...o, live: true, stageAt: Date.now() }
            : o,
        ),
      ),
    [],
  );

  const clearCanceled = useCallback(
    () => setOrders((list) => list.filter((o) => o.status !== "canceled")),
    [],
  );

  const value = useMemo(
    () => ({
      orders,
      getOrder: (id?: string) => orders.find((o) => o.id === id),
      placeOrder,
      cancelOrder,
      startTracking,
      clearCanceled,
    }),
    [orders, placeOrder, cancelOrder, startTracking, clearCanceled],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}
