import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AppNotification,
  Review,
  seedNotifications,
  seedReviews,
} from "@/assets/data/account";

export type Settings = {
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
};

type AccountContextValue = {
  favourites: string[];
  isFavourite: (foodId: string) => boolean;
  toggleFavourite: (foodId: string) => void;
  favouriteRestaurants: string[];
  isFavouriteRestaurant: (restaurantId: string) => boolean;
  toggleFavouriteRestaurant: (restaurantId: string) => void;

  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;

  reviews: Review[];
  reviewFor: (orderId: string) => Review | undefined;
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  updateReview: (id: string, changes: Partial<Omit<Review, "id">>) => void;
  deleteReview: (id: string) => void;

  settings: Settings;
  setSetting: (key: keyof Settings, value: boolean) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

/**
 * In-memory account state behind the Profile menu: favourites, notifications,
 * reviews and settings. Swap the internals for an API / storage later.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>(["f1", "f7"]);
  const [favouriteRestaurants, setFavouriteRestaurants] = useState<string[]>(["r1"]);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [reviews, setReviews] = useState(seedReviews);
  const [settings, setSettings] = useState<Settings>({
    push: true,
    orderUpdates: true,
    promotions: false,
  });

  const toggleFavourite = useCallback(
    (id: string) =>
      setFavourites((list) =>
        list.includes(id) ? list.filter((f) => f !== id) : [id, ...list],
      ),
    [],
  );

  const toggleFavouriteRestaurant = useCallback(
    (id: string) =>
      setFavouriteRestaurants((list) =>
        list.includes(id) ? list.filter((f) => f !== id) : [id, ...list],
      ),
    [],
  );

  const markRead = useCallback(
    (id: string) =>
      setNotifications((list) =>
        list.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [],
  );

  const markAllRead = useCallback(
    () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
    [],
  );

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "time" | "read">) => {
      if (
        (n.type === "order" || n.type === "delivery") &&
        !settings.orderUpdates
      )
        return;
      if (n.type === "offer" && !settings.promotions) return;
      setNotifications((list) => [
        { ...n, id: `n${Date.now()}`, time: "Just now", read: false },
        ...list,
      ]);
    },
    [settings.orderUpdates, settings.promotions],
  );

  const addReview = useCallback(
    (r: Omit<Review, "id" | "createdAt">) =>
      setReviews((list) => [
        { ...r, id: `rv${Date.now()}`, createdAt: new Date().toISOString() },
        ...list,
      ]),
    [],
  );

  const updateReview = useCallback(
    (id: string, changes: Partial<Omit<Review, "id">>) =>
      setReviews((list) =>
        list.map((r) => (r.id === id ? { ...r, ...changes } : r)),
      ),
    [],
  );

  const deleteReview = useCallback(
    (id: string) => setReviews((list) => list.filter((r) => r.id !== id)),
    [],
  );

  const setSetting = useCallback(
    (key: keyof Settings, value: boolean) =>
      setSettings((s) => ({ ...s, [key]: value })),
    [],
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      favourites,
      isFavourite: (id) => favourites.includes(id),
      toggleFavourite,
      favouriteRestaurants,
      isFavouriteRestaurant: (id) => favouriteRestaurants.includes(id),
      toggleFavouriteRestaurant,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markRead,
      markAllRead,
      addNotification,
      reviews,
      reviewFor: (orderId) => reviews.find((r) => r.orderId === orderId),
      addReview,
      updateReview,
      deleteReview,
      settings,
      setSetting,
    }),
    [
      favourites,
      toggleFavourite,
      favouriteRestaurants,
      toggleFavouriteRestaurant,
      notifications,
      markRead,
      markAllRead,
      addNotification,
      reviews,
      addReview,
      updateReview,
      deleteReview,
      settings,
      setSetting,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
