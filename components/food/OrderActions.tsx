import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Order } from "@/assets/data/food";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { showAlert } from "@/utils/alerts";

function ActionButton({
  title,
  variant,
  onPress,
  disabled,
}: {
  title: string;
  variant: "filled" | "outline";
  onPress: () => void;
  disabled?: boolean;
}) {
  const filled = variant === "filled";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      className={`h-[46px] flex-1 items-center justify-center rounded-[10px] border ${
        filled ? "border-primary bg-primary" : "border-primary bg-white"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Text
        className={`text-sm font-bold ${filled ? "text-white" : "text-primary"}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * The right buttons for an order's status:
 * ongoing → Track Order / Cancel, otherwise Rate / Re-Order.
 */
export default function OrderActions({ order }: { order: Order }) {
  const { cancelOrder } = useOrders();
  const { addItem } = useCart();
  const { reviewFor } = useAccount();
  const rated = !!reviewFor(order.id);

  const confirmCancel = () =>
    showAlert("Cancel order", `Cancel order #${order.id}?`, [
      { text: "Keep order", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: () => cancelOrder(order.id),
      },
    ]);

  const reorder = () => {
    order.lines.forEach((l) => addItem({ ...l }));
    router.push("/(main)/cart");
  };

  if (order.status === "ongoing") {
    return (
      <View className="flex-row gap-5">
        <ActionButton
          title="Track Order"
          variant="filled"
          onPress={() =>
            router.push({ pathname: "/(main)/track/[id]", params: { id: order.id } })
          }
        />
        <ActionButton title="Cancel" variant="outline" onPress={confirmCancel} />
      </View>
    );
  }

  return (
    <View className="flex-row gap-5">
      <ActionButton
        title={rated ? "Edit Rating" : "Rate"}
        variant="outline"
        disabled={order.status === "canceled"}
        onPress={() =>
          router.push({
            pathname: "/(main)/rate/[orderId]",
            params: { orderId: order.id },
          })
        }
      />
      <ActionButton title="Re-Order" variant="filled" onPress={reorder} />
    </View>
  );
}
