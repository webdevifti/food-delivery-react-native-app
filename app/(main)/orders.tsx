import { formatPrice, Order } from "@/assets/data/food";
import CircleButton from "@/components/food/CircleButton";
import OrderActions from "@/components/food/OrderActions";
import ActionSheet from "@/components/ui/ActionSheet";
import BackButton from "@/components/ui/BackButton";
import { useOrders } from "@/context/OrdersContext";
import { showAlert } from "@/utils/alerts";
import {
  formatOrderDate,
  itemsLabel,
  orderImage,
  orderRestaurant,
  orderTotal,
} from "@/utils/orders";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "ongoing" | "history";

function OrderCard({ order, history }: { order: Order; history: boolean }) {
  const restaurant = orderRestaurant(order);
  const statusColor =
    order.status === "completed" ? "text-[#059C6A]" : "text-[#FF0000]";

  return (
    <View className="mb-6">
      <View className="flex-row items-center gap-4 border-b border-[#EAEAEA] pb-3">
        <Text className="text-base text-secondary">Food</Text>
        {history && (
          <Text className={`text-base font-bold ${statusColor}`}>
            {order.status === "completed" ? "Completed" : "Canceled"}
          </Text>
        )}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Order ${order.id} details`}
        activeOpacity={0.8}
        onPress={() =>
          router.push({ pathname: "/(main)/order/[id]", params: { id: order.id } })
        }
        className="flex-row items-center gap-4 py-5"
      >
        <Image
          source={{ uri: orderImage(order) }}
          contentFit="cover"
          transition={200}
          style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: "#ECF0F4" }}
        />
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text numberOfLines={1} className="flex-1 text-base font-bold text-secondary">
              {restaurant?.shortName ?? "Order"}
            </Text>
            <Text className="text-sm text-textLight underline">#{order.id}</Text>
          </View>
          <View className="mt-2 flex-row items-center">
            <Text className="text-base font-bold text-secondary">
              {formatPrice(orderTotal(order))}
            </Text>
            <View className="mx-3 h-4 w-px bg-[#CED7DF]" />
            <Text numberOfLines={1} className="flex-1 text-sm text-textLight">
              {history
                ? `${formatOrderDate(order.createdAt)}  •  ${itemsLabel(order)}`
                : itemsLabel(order)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <OrderActions order={order} />
    </View>
  );
}

export default function Orders() {
  const { orders, clearCanceled } = useOrders();
  const [tab, setTab] = useState<Tab>("ongoing");
  const [menuOpen, setMenuOpen] = useState(false);

  const list = orders.filter((o) =>
    tab === "ongoing" ? o.status === "ongoing" : o.status !== "ongoing",
  );
  const hasCanceled = orders.some((o) => o.status === "canceled");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-6 pb-4 pt-3">
        <View className="flex-row items-center gap-4">
          <BackButton />
          <Text accessibilityRole="header" className="text-base text-secondary">
            My Orders
          </Text>
        </View>
        <CircleButton label="Order options" onPress={() => setMenuOpen(true)}>
          <Feather name="more-horizontal" size={22} color="#181C2E" />
        </CircleButton>
      </View>

      <View accessibilityRole="tablist" className="flex-row border-b border-[#EAEAEA]">
        {(["ongoing", "history"] as const).map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity
              key={t}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              activeOpacity={0.8}
              onPress={() => setTab(t)}
              className={`-mb-px flex-1 items-center border-b-2 py-4 ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              <Text className={`text-sm ${active ? "font-bold text-primary" : "text-muted"}`}>
                {t === "ongoing" ? "Ongoing" : "History"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
          flexGrow: 1,
        }}
      >
        {list.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8 pb-24">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
              <Feather name="clipboard" size={38} color="#A0A5BA" />
            </View>
            <Text className="mt-6 text-lg font-semibold text-secondary">
              {tab === "ongoing" ? "No ongoing orders" : "No past orders yet"}
            </Text>
            <Text className="mt-1 text-center text-base text-textLight">
              {tab === "ongoing"
                ? "When you place an order, you can track it here."
                : "Your completed and canceled orders will show up here."}
            </Text>
          </View>
        ) : (
          list.map((o) => (
            <OrderCard key={o.id} order={o} history={tab === "history"} />
          ))
        )}
      </ScrollView>

      <ActionSheet
        visible={menuOpen}
        title="Order options"
        onClose={() => setMenuOpen(false)}
        options={[
          {
            label: "Contact support",
            icon: <Feather name="headphones" size={18} color="#181C2E" />,
            onPress: () =>
              Linking.openURL("mailto:support@fooddelivery.example?subject=Help%20with%20my%20order"),
          },
          ...(hasCanceled
            ? [
                {
                  label: "Clear canceled orders",
                  destructive: true,
                  icon: <Feather name="trash-2" size={18} color="#E5484D" />,
                  onPress: () =>
                    showAlert("Clear canceled orders", "Remove all canceled orders from your history?", [
                      { text: "Cancel", style: "cancel" as const },
                      { text: "Clear", style: "destructive" as const, onPress: clearCanceled },
                    ]),
                },
              ]
            : []),
        ]}
      />
    </SafeAreaView>
  );
}
