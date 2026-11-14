import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PaymentMethod } from "@/assets/data/food";

function Logo({ id }: { id: PaymentMethod["id"] }) {
  switch (id) {
    case "cash":
      return <MaterialCommunityIcons name="hand-coin-outline" size={30} color="#FF7622" />;
    case "visa":
      return (
        <Text className="text-[22px] font-extrabold italic text-[#1A4FA3]">
          VISA
        </Text>
      );
    case "mastercard":
      return (
        <View className="flex-row items-center">
          <View className="h-[22px] w-[22px] rounded-full bg-[#EB001B]" />
          <View className="-ml-2.5 h-[22px] w-[22px] rounded-full bg-[#F79E1B]/90" />
        </View>
      );
    case "paypal":
      return (
        <Text className="text-lg font-extrabold italic text-[#003087]">
          Pay<Text className="text-[#009CDE]">Pal</Text>
        </Text>
      );
  }
}

type Props = {
  method: PaymentMethod;
  selected: boolean;
  onPress: () => void;
};

/** Selectable payment-method tile with an orange check badge when selected. */
export default function PaymentMethodTile({ method, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={method.name}
      activeOpacity={0.85}
      onPress={onPress}
      className="items-center"
    >
      <View
        className={`h-[74px] w-[96px] items-center justify-center rounded-[10px] border-2 ${
          selected ? "border-primary bg-white" : "border-transparent bg-field"
        }`}
      >
        <Logo id={method.id} />
        {selected && (
          <View className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Feather name="check" size={14} color="white" />
          </View>
        )}
      </View>
      <Text className="mt-2 text-sm text-secondary">{method.name}</Text>
    </TouchableOpacity>
  );
}
