import { getFood, getRestaurant, Order } from "@/assets/data/food";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const orderTotal = (o: Order) =>
  o.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

export const orderItemCount = (o: Order) =>
  o.lines.reduce((n, l) => n + l.qty, 0);

/** "03 Items" / "01 Items", as in the design. */
export const itemsLabel = (o: Order) =>
  `${String(orderItemCount(o)).padStart(2, "0")} Items`;

/** The restaurant of the first dish stands in for the whole order. */
export const orderRestaurant = (o: Order) =>
  getRestaurant(getFood(o.lines[0]?.foodId)?.restaurantId);

export const orderImage = (o: Order) => getFood(o.lines[0]?.foodId)?.image;

/** "29 JAN, 12:30" */
export const formatOrderDate = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hh}:${mm}`;
};

/* ----------------------------- Tracking ----------------------------- */

export const STAGES = [
  { title: "Order placed", subtitle: "We've received your order" },
  { title: "Preparing your food", subtitle: "The restaurant is cooking" },
  { title: "On the way", subtitle: "Your courier is heading to you" },
  { title: "Delivered", subtitle: "Enjoy your meal!" },
] as const;

/** Minutes shown per stage in the ETA (the demo runs faster than real time). */
const DISPLAY_MIN_PER_STAGE = 6;

/** Courier progress along the route, 0 (restaurant) to 1 (your door). */
export function courierProgress(stage: number, stageElapsedFrac: number) {
  if (stage <= 0) return 0;
  if (stage === 1) return 0.04;
  if (stage === 2) return 0.1 + 0.85 * Math.min(1, Math.max(0, stageElapsedFrac));
  return 1;
}

/** Estimated minutes until delivery, never below 1 while ongoing. */
export function etaMinutes(stage: number, stageElapsedFrac: number) {
  const remainingStages = 3 - stage - Math.min(1, Math.max(0, stageElapsedFrac));
  return Math.max(1, Math.ceil(remainingStages * DISPLAY_MIN_PER_STAGE));
}
