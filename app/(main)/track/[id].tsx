import { getFood } from "@/assets/data/food";
import OrderTimeline from "@/components/food/OrderTimeline";
import RouteMap from "@/components/food/RouteMap";
import BackButton from "@/components/ui/BackButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StarRating from "@/components/ui/StarRating";
import { STAGE_MS, useOrders } from "@/context/OrdersContext";
import { useNow } from "@/hooks/useNow";
import { showAlert } from "@/utils/alerts";
import {
  courierProgress,
  etaMinutes,
  itemsLabel,
  orderRestaurant,
  STAGES,
} from "@/utils/orders";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Dummy courier. A real app would get this from the order. */
const COURIER = {
  name: "Alex Morgan",
  rating: 4.9,
  vehicle: "Motorbike • 7QR 214",
  phone: "+15550100",
};

export default function TrackOrder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, startTracking, cancelOrder } = useOrders();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const now = useNow(1000);
  const order = getOrder(id);

  // Demo: begin simulating progress as soon as the user opens tracking.
  useEffect(() => {
    if (order) startTracking(order.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  if (!order) {
    return (
      <View style={{ paddingTop: insets.top + 12 }} className="flex-1 bg-white px-6">
        <StatusBar style="dark" />
        <BackButton />
        <Text className="mt-20 text-center text-lg text-textLight">
          This order couldn&apos;t be found.
        </Text>
      </View>
    );
  }

  const canceled = order.status === "canceled";
  const delivered = order.stage >= 3;
  const elapsed = order.live && order.stageAt ? (now - order.stageAt) / STAGE_MS : 0;
  const progress = courierProgress(order.stage, elapsed);
  const eta = etaMinutes(order.stage, elapsed);
  const restaurant = orderRestaurant(order);
  const firstFood = getFood(order.lines[0]?.foodId);

  const headline = canceled
    ? "Order canceled"
    : delivered
      ? "Delivered"
      : STAGES[order.stage].title;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
      >
        <View>
          <RouteMap width={width} progress={progress} showCourier={order.stage >= 2 && !canceled} />
          <View
            style={{ top: insets.top + 12 }}
            className="absolute left-6 right-6 flex-row items-center justify-between"
          >
            <BackButton dark />
            <View className="rounded-full bg-white px-4 py-2">
              <Text className="text-sm font-semibold text-secondary">#{order.id}</Text>
            </View>
          </View>
        </View>

        <View
          style={{ marginTop: -24, minHeight: 200 }}
          className="rounded-t-[24px] bg-white px-6 pt-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[13px] uppercase tracking-wide text-muted">
                {delivered || canceled ? "Status" : "Estimated arrival"}
              </Text>
              <Text accessibilityRole="header" className="mt-1 text-[28px] font-bold text-secondary">
                {delivered || canceled ? headline : `${eta} min`}
              </Text>
              {!delivered && !canceled && (
                <Text className="mt-0.5 text-sm text-textLight">{headline}</Text>
              )}
            </View>
            {firstFood && (
              <View className="items-end">
                <Text className="text-sm font-semibold text-secondary">
                  {restaurant?.shortName}
                </Text>
                <Text className="mt-0.5 text-xs text-textLight">{itemsLabel(order)}</Text>
              </View>
            )}
          </View>

          {/* Segmented progress */}
          {!canceled && (
            <View className="mt-5 flex-row gap-2">
              {STAGES.map((s, i) => (
                <View
                  key={s.title}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= order.stage ? "bg-primary" : "bg-[#E8EBF0]"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Courier */}
          {order.stage >= 2 && !canceled && !delivered && (
            <View className="mt-6 flex-row items-center gap-4 rounded-2xl bg-surface p-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#369BFF]">
                <Text className="text-xl font-bold text-white">
                  {COURIER.name[0]}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-secondary">{COURIER.name}</Text>
                <View className="mt-1 flex-row items-center gap-2">
                  <StarRating value={COURIER.rating} size={14} />
                  <Text className="text-xs text-textLight">{COURIER.rating}</Text>
                </View>
                <Text className="mt-0.5 text-xs text-muted">{COURIER.vehicle}</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Call ${COURIER.name}`}
                onPress={() => Linking.openURL(`tel:${COURIER.phone}`)}
                className="h-11 w-11 items-center justify-center rounded-full bg-primary"
              >
                <Feather name="phone" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
          {order.stage < 2 && !canceled && (
            <View className="mt-6 flex-row items-center gap-3 rounded-2xl bg-surface p-4">
              <Feather name="clock" size={20} color="#FF7622" />
              <Text className="flex-1 text-sm text-textLight">
                A courier will be assigned as soon as your food is ready.
              </Text>
            </View>
          )}

          <Text className="mb-4 mt-7 text-[13px] uppercase tracking-wide text-muted">
            Order status
          </Text>
          <OrderTimeline stage={order.stage} canceled={canceled} />

          <View className="mt-2 gap-3">
            {delivered && (
              <PrimaryButton
                title="Rate your order"
                onPress={() =>
                  router.replace({
                    pathname: "/(main)/rate/[orderId]",
                    params: { orderId: order.id },
                  })
                }
              />
            )}
            <PrimaryButton
              title="Order details"
              variant="outline"
              onPress={() =>
                router.push({ pathname: "/(main)/order/[id]", params: { id: order.id } })
              }
            />
            {!canceled && !delivered && order.stage <= 1 && (
              <TouchableOpacity
                accessibilityRole="button"
                hitSlop={8}
                onPress={() =>
                  showAlert("Cancel order", `Cancel order #${order.id}?`, [
                    { text: "Keep order", style: "cancel" },
                    {
                      text: "Yes, cancel",
                      style: "destructive",
                      onPress: () => cancelOrder(order.id),
                    },
                  ])
                }
                className="items-center py-3"
              >
                <Text className="text-sm font-semibold text-danger">Cancel order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
