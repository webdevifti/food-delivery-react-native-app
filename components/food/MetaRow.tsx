import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  rating: number;
  deliveryFee: string;
  time: string;
};

/** Rating · delivery fee · time row used on restaurant cards and details. */
export default function MetaRow({ rating, deliveryFee, time }: Props) {
  return (
    <View className="flex-row items-center gap-5">
      <View className="flex-row items-center gap-1.5">
        <Feather name="star" size={20} color="#FF7622" />
        <Text className="text-base font-bold text-secondary">
          {rating.toFixed(1)}
        </Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Feather name="truck" size={20} color="#FF7622" />
        <Text className="text-sm text-secondary">{deliveryFee}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Feather name="clock" size={20} color="#FF7622" />
        <Text className="text-sm text-secondary">{time}</Text>
      </View>
    </View>
  );
}
