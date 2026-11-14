import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "@/assets/data/food";
import { useCart } from "@/context/CartContext";

/** Extra bottom padding screens need so content isn't hidden behind the bar. */
export const MINI_CART_SPACE = 88;

/**
 * Floating "View cart" bar pinned to the bottom of food screens. Only shows
 * once something has been added. Render it inside a `relative` screen root.
 */
export default function MiniCart() {
  const { count, total } = useCart();
  const insets = useSafeAreaInsets();
  if (count === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: insets.bottom + 12 }}
      className="absolute left-6 right-6"
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${count} items, total ${formatPrice(total)}`}
        activeOpacity={0.9}
        onPress={() => router.push("/(main)/cart")}
        className="h-[58px] flex-row items-center justify-between rounded-2xl bg-navy px-5 shadow-lg"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Text className="text-sm font-bold text-white">{count}</Text>
          </View>
          <Text className="text-sm font-bold uppercase tracking-wider text-white">
            View cart
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-white">
            {formatPrice(total)}
          </Text>
          <Feather name="chevron-right" size={18} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
