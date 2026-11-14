import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useCart } from "@/context/CartContext";
import CircleButton from "./CircleButton";

/** Navy cart button with an orange item-count badge. */
export default function CartButton() {
  const { count } = useCart();

  return (
    <View>
      <CircleButton
        dark
        label={`Cart, ${count} items`}
        onPress={() => router.push("/(main)/cart")}
      >
        <SimpleLineIcons name="bag" size={18} color="white" />
      </CircleButton>
      {count > 0 && (
        <View
          pointerEvents="none"
          className="absolute -right-1.5 -top-2 h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5"
        >
          <Text className="text-xs font-bold text-white">{count}</Text>
        </View>
      )}
    </View>
  );
}
