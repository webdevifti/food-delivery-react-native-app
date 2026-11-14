import raw from "./food.json";

export type Category = {
  id: string;
  name: string;
  /** Heading for the category screen, e.g. "Popular Burgers". */
  title: string;
  image: string | null;
};

export type OfferKey = "Delivery" | "Pick Up" | "Offer" | "Online payment available";

export type Restaurant = {
  id: string;
  name: string;
  shortName: string;
  image: string;
  /** Photos shown in the restaurant page carousel (first is the cover). */
  gallery: string[];
  tags: string[];
  categoryIds: string[];
  offers: OfferKey[];
  /** 1 = $, 2 = $$, 3 = $$$ */
  priceLevel: 1 | 2 | 3;
  rating: number;
  deliveryFee: string;
  time: string;
};

export type PaymentMethodId = "cash" | "visa" | "mastercard" | "paypal";

export type PaymentMethod = { id: PaymentMethodId; name: string };

export type IngredientKey =
  | "salt"
  | "chicken"
  | "beef"
  | "cheese"
  | "herbs"
  | "chili"
  | "egg"
  | "mushroom"
  | "fish";

export type Food = {
  id: string;
  name: string;
  restaurantId: string;
  categoryId: string;
  price: number;
  rating: number;
  deliveryFee: string;
  time: string;
  image: string;
  description: string;
  ingredients: IngredientKey[];
};

export type Size = { label: string; multiplier: number };

export type OrderStatus = "ongoing" | "completed" | "canceled";

export type OrderLine = {
  foodId: string;
  size: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  /** ISO date string. */
  createdAt: string;
  lines: OrderLine[];
  /** 0 placed, 1 preparing, 2 on the way, 3 delivered. */
  stage: number;
  /** Delivery address text at the time of ordering. */
  address?: string;
  /** Payment label, e.g. "Cash on delivery" or "Visa •••• 4242". */
  payment?: string;
  /** Epoch ms when the order entered its current stage (demo simulation). */
  stageAt?: number;
  /** When true, the demo simulation advances this order's stage over time. */
  live?: boolean;
};

export type FoodData = {
  offer: { title: string; code: string; description: string };
  sizes: Size[];
  recentKeywords: string[];
  categories: Category[];
  restaurants: Restaurant[];
  foods: Food[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
};

/**
 * Dummy data lives in `food.json`. Replace these helpers with API calls
 * later; the screens only talk to this module.
 */
const data = raw as FoodData;

export const offer = data.offer;
export const sizes = data.sizes;
export const recentKeywords = data.recentKeywords;
export const categories = data.categories;
export const restaurants = data.restaurants;
export const foods = data.foods;
export const paymentMethods = data.paymentMethods;
export const seedOrders = data.orders;

export const getCategory = (id?: string) =>
  categories.find((c) => c.id === id);

export const getFood = (id?: string) => foods.find((f) => f.id === id);

export const getRestaurant = (id?: string) =>
  restaurants.find((r) => r.id === id);

export const foodsInCategory = (categoryId: string) =>
  categoryId === "all"
    ? foods
    : foods.filter((f) => f.categoryId === categoryId);

export const restaurantsInCategory = (categoryId: string) =>
  categoryId === "all"
    ? restaurants
    : restaurants.filter((r) => r.categoryIds.includes(categoryId));

/** Lowest dish price in a category (for "Starting $70" style labels). */
export const startingPrice = (categoryId: string) => {
  const list = foodsInCategory(categoryId);
  return list.length ? Math.min(...list.map((f) => f.price)) : 0;
};

export const formatPrice = (value: number) =>
  `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

const includes = (text: string, q: string) =>
  text.toLowerCase().includes(q.toLowerCase());

export const searchRestaurants = (query: string) => {
  const q = query.trim();
  if (!q) return restaurants;
  return restaurants.filter(
    (r) => includes(r.name, q) || r.tags.some((t) => includes(t, q)),
  );
};

export const searchFoods = (query: string) => {
  const q = query.trim();
  if (!q) return foods;
  return foods.filter(
    (f) =>
      includes(f.name, q) ||
      includes(getRestaurant(f.restaurantId)?.name ?? "", q) ||
      includes(getCategory(f.categoryId)?.name ?? "", q),
  );
};

export const foodsOfRestaurant = (restaurantId: string) =>
  foods.filter((f) => f.restaurantId === restaurantId);

/* ----------------------------- Filters ----------------------------- */

export type Filters = {
  offers: OfferKey[];
  /** Max delivery minutes, or null for any. */
  maxTime: number | null;
  price: 1 | 2 | 3 | null;
  /** Minimum star rating, 0 = any. */
  rating: number;
};

export const emptyFilters: Filters = {
  offers: [],
  maxTime: null,
  price: null,
  rating: 0,
};

export const offerOptions: OfferKey[] = [
  "Delivery",
  "Pick Up",
  "Offer",
  "Online payment available",
];

export const timeOptions = [
  { label: "10-15 min", max: 15 },
  { label: "20 min", max: 20 },
  { label: "30 min", max: 30 },
];

export const priceOptions = [1, 2, 3] as const;

export const priceLevelOf = (price: number): 1 | 2 | 3 =>
  price < 30 ? 1 : price < 60 ? 2 : 3;

export const hasActiveFilters = (f: Filters) =>
  f.offers.length > 0 || f.maxTime !== null || f.price !== null || f.rating > 0;

export const restaurantMatches = (r: Restaurant, f: Filters) =>
  f.offers.every((o) => r.offers.includes(o)) &&
  (f.maxTime === null || parseInt(r.time, 10) <= f.maxTime) &&
  (f.price === null || r.priceLevel === f.price) &&
  r.rating >= f.rating;

/** Offers and delivery time come from the dish's restaurant. */
export const foodMatches = (food: Food, f: Filters) => {
  const restaurant = getRestaurant(food.restaurantId);
  if (restaurant) {
    if (!f.offers.every((o) => restaurant.offers.includes(o))) return false;
    if (f.maxTime !== null && parseInt(restaurant.time, 10) > f.maxTime)
      return false;
  }
  if (f.price !== null && priceLevelOf(food.price) !== f.price) return false;
  return food.rating >= f.rating;
};
