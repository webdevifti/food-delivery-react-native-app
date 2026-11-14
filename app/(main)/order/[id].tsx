import { formatPrice, getFood } from "@/assets/data/food";
import OrderActions from "@/components/food/OrderActions";
import OrderTimeline from "@/components/food/OrderTimeline";
import Screen from "@/components/ui/Screen";
import { useOrders } from "@/context/OrdersContext";
import {
  formatOrderDate,
  itemsLabel,
  orderRestaurant,
  orderTotal,
} from "@/utils/orders";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const STATUS_STYLE = {
  ongoing: { label: "Ongoing", text: "text-primary", bg: "bg-[#FFEBE4]" },
  completed: { label: "Completed", text: "text-[#059C6A]", bg: "bg-[#E3F6EE]" },
  canceled: { label: "Canceled", text: "text-[#E5484D]", bg: "bg-[#FFECEC]" },
} as const;

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View className="mb-5">
      {title && (
        <Text className="mb-3 text-[13px] uppercase tracking-wide text-muted">
          {title}
        </Text>
      )}
      <View className="rounded-2xl bg-surface p-5">{children}</View>
    </View>
  );
}

function BillRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className={`text-base ${bold ? "font-bold text-secondary" : "text-textLight"}`}>
        {label}
      </Text>
      <Text className={`text-base ${bold ? "text-xl font-bold text-secondary" : "text-secondary"}`}>
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-4 py-2">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <Feather name={icon} size={16} color="#FF7622" />
      </View>
      <View className="flex-1">
        <Text className="text-xs uppercase text-textLight">{label}</Text>
        <Text className="mt-0.5 text-sm font-semibold text-secondary">{value}</Text>
      </View>
    </View>
  );
}

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder } = useOrders();
  const order = getOrder(id);

  if (!order) {
    return (
      <Screen title="Order Details">
        <Text className="mt-20 text-center text-lg text-textLight">
          This order couldn&apos;t be found.
        </Text>
      </Screen>
    );
  }

  const restaurant = orderRestaurant(order);
  const status = STATUS_STYLE[order.status];
  const total = orderTotal(order);

  return (
    <Screen
      title="Order Details"
      right={
        <Text className="text-sm text-textLight underline">#{order.id}</Text>
      }
      footer={<OrderActions order={order} />}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View className={`rounded-full px-4 py-2 ${status.bg}`}>
          <Text className={`text-sm font-bold ${status.text}`}>{status.label}</Text>
        </View>
        <Text className="text-sm text-textLight">
          {formatOrderDate(order.createdAt)}  •  {itemsLabel(order)}
        </Text>
      </View>

      {restaurant && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={restaurant.name}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(main)/restaurant/[id]",
              params: { id: restaurant.id },
            })
          }
          className="mb-5 flex-row items-center gap-4 rounded-2xl bg-surface p-4"
        >
          <Image
            source={{ uri: restaurant.image }}
            contentFit="cover"
            style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#ECF0F4" }}
          />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-base font-bold text-secondary">
              {restaurant.name}
            </Text>
            <Text numberOfLines={1} className="mt-0.5 text-sm text-muted">
              {restaurant.tags.join(" - ")}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color="#747783" />
        </TouchableOpacity>
      )}

      <Card title="Items">
        {order.lines.map((l, i) => {
          const food = getFood(l.foodId);
          if (!food) return null;
          return (
            <TouchableOpacity
              key={`${l.foodId}-${l.size}`}
              accessibilityRole="button"
              accessibilityLabel={food.name}
              activeOpacity={0.8}
              onPress={() =>
                router.push({ pathname: "/(main)/food/[id]", params: { id: food.id } })
              }
              className={`flex-row items-center gap-4 ${
                i < order.lines.length - 1 ? "mb-4" : ""
              }`}
            >
              <Image
                source={{ uri: food.image }}
                contentFit="cover"
                style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#ECF0F4" }}
              />
              <View className="flex-1">
                <Text numberOfLines={1} className="text-base font-semibold text-secondary">
                  {food.name}
                </Text>
                <Text className="mt-0.5 text-sm text-textLight">
                  {l.size}  •  {l.qty} × {formatPrice(l.unitPrice)}
                </Text>
              </View>
              <Text className="text-base font-bold text-secondary">
                {formatPrice(l.qty * l.unitPrice)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>

      <Card title="Bill">
        <BillRow label="Subtotal" value={formatPrice(total)} />
        <BillRow label="Delivery fee" value="Free" />
        <BillRow label="Discount" value="$0" />
        <View className="my-2 h-px bg-[#E4E8EE]" />
        <BillRow label="Total" value={formatPrice(total)} bold />
      </Card>

      <Card title="Details">
        <InfoRow
          icon="map-pin"
          label="Delivery address"
          value={order.address ?? "Not available"}
        />
        <InfoRow
          icon="credit-card"
          label="Payment"
          value={order.payment ?? "Not available"}
        />
        <InfoRow
          icon="calendar"
          label="Ordered on"
          value={formatOrderDate(order.createdAt)}
        />
      </Card>

      <Card title="Status">
        <OrderTimeline stage={order.stage} canceled={order.status === "canceled"} />
      </Card>
    </Screen>
  );
}
