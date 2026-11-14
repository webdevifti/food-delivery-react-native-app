import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Category } from "@/assets/data/food";
import { softShadow } from "./shadow";

type Props = {
  category: Category;
  active: boolean;
  onPress: () => void;
};

/** Pill with a round thumbnail. The active one is filled yellow. */
export default function CategoryChip({ category, active, onPress }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={category.name}
      activeOpacity={0.85}
      onPress={onPress}
      style={active ? undefined : softShadow}
      className={`h-[56px] flex-row items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 ${
        active ? "bg-[#FFD27C]" : "bg-white"
      }`}
    >
      <View className="h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full bg-white">
        {category.image ? (
          <Image
            source={{ uri: category.image }}
            contentFit="cover"
            style={{ width: 44, height: 44 }}
          />
        ) : (
          <Ionicons name="flame" size={26} color="#FF7622" />
        )}
      </View>
      <Text
        className={`text-sm text-secondary ${active ? "font-bold" : "font-semibold"}`}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
