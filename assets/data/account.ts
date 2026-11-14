import raw from "./account.json";

export type NotificationType = "order" | "offer" | "delivery" | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Review = {
  id: string;
  restaurantId: string;
  orderId?: string;
  /** Overall / food rating, 1-5. */
  rating: number;
  /** Delivery rating, 1-5. */
  deliveryRating?: number;
  tags?: string[];
  comment: string;
  /** ISO date string. */
  createdAt: string;
};

export type Faq = { q: string; a: string };

export type LegalDoc = {
  title: string;
  sections: { heading: string; body: string }[];
};

type AccountData = {
  notifications: AppNotification[];
  faqs: Faq[];
  reviews: Review[];
  legal: { terms: LegalDoc; privacy: LegalDoc };
};

/** Dummy account data lives in `account.json`; swap for an API later. */
const data = raw as AccountData;

export const seedNotifications = data.notifications;
export const seedReviews = data.reviews;
export const faqs = data.faqs;
export const legal = data.legal;
