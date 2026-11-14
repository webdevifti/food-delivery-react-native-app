import { router } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/context/AccountContext";
import { useOrders } from "@/context/OrdersContext";
import { usePayment } from "@/context/PaymentContext";
import { useUser } from "@/context/UserContext";
import { showAlert } from "@/utils/alerts";

/** Turns the cart into an ongoing order, clears the cart and confirms. */
export function usePlaceOrder() {
  const { items, clear } = useCart();
  const { placeOrder } = useOrders();
  const { addNotification } = useAccount();
  const { addresses } = useUser();
  const { method, cardFor } = usePayment();

  return () => {
    if (items.length === 0) return;
    const a = addresses[0];
    const card = method === "visa" || method === "mastercard" ? cardFor(method) : undefined;
    const order = placeOrder(items, {
      address: a
        ? [a.address, a.apartment && `Apt ${a.apartment}`, a.street, a.postCode]
            .filter(Boolean)
            .join(", ")
        : undefined,
      payment: card
        ? `${card.brand === "visa" ? "Visa" : "Mastercard"} •••• ${card.last4}`
        : "Cash on delivery",
    });
    addNotification({
      type: "order",
      title: "Order placed",
      body: `Order #${order.id} was placed successfully. We'll let you know when it's on the way.`,
    });
    clear();
    showAlert("Order placed!", "Your order is on its way.", [
      {
        text: "View orders",
        onPress: () => {
          router.dismissTo("/(main)/home");
          router.push("/(main)/orders");
        },
      },
      { text: "Back to home", onPress: () => router.dismissTo("/(main)/home") },
    ]);
  };
}
