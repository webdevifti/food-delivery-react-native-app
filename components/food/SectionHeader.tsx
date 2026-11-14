import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        accessibilityRole="header"
        className="text-xl text-secondary"
      >
        {title}
      </Text>
      {actionLabel && (
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={8}
          onPress={onAction}
          className="flex-row items-center"
        >
          <Text className="text-sm text-secondary">{actionLabel}</Text>
          <Entypo name="chevron-small-right" size={22} color="#747783" />
        </TouchableOpacity>
      )}
    </View>
  );
}
