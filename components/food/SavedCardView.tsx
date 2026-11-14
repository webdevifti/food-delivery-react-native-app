import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { SavedCard } from "@/context/PaymentContext";

/** A saved card rendered as an orange gradient credit card. */
export default function SavedCardView({ card }: { card: SavedCard }) {
  return (
    <LinearGradient
      colors={["#FF9A3D", "#FF7622", "#E8001B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: "100%", maxWidth: 300, borderRadius: 16, padding: 20 }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-extrabold italic uppercase text-white">
          {card.brand}
        </Text>
        <View className="flex-row items-center">
          <View className="h-5 w-5 rounded-full bg-white/70" />
          <View className="-ml-2 h-5 w-5 rounded-full bg-white/40" />
        </View>
      </View>
      <Text className="mt-8 text-xl font-semibold tracking-widest text-white">
        •••• •••• •••• {card.last4}
      </Text>
      <View className="mt-5 flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[10px] uppercase text-white/70">Card holder</Text>
          <Text numberOfLines={1} className="text-sm font-semibold text-white">
            {card.holder}
          </Text>
        </View>
        <View>
          <Text className="text-[10px] uppercase text-white/70">Expires</Text>
          <Text className="text-sm font-semibold text-white">{card.expiry}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
