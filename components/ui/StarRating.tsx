import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  value: number;
  /** When omitted the stars are read-only. */
  onChange?: (value: number) => void;
  size?: number;
  gap?: number;
};

export default function StarRating({ value, onChange, size = 18, gap = 0 }: Props) {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    const on = n <= Math.round(value);
    const icon = (
      <MaterialCommunityIcons
        name={on ? "star" : "star-outline"}
        size={size}
        color={on ? "#FFAA2A" : "#C9CCD6"}
      />
    );
    if (!onChange) return <View key={n}>{icon}</View>;
    return (
      <TouchableOpacity
        key={n}
        accessibilityRole="button"
        accessibilityLabel={`${n} star${n > 1 ? "s" : ""}`}
        accessibilityState={{ selected: n <= value }}
        hitSlop={4}
        onPress={() => onChange(n)}
      >
        {icon}
      </TouchableOpacity>
    );
  });

  return (
    <View
      accessible={!onChange}
      accessibilityLabel={onChange ? undefined : `${value} out of 5 stars`}
      style={{ gap }}
      className="flex-row"
    >
      {stars}
    </View>
  );
}
