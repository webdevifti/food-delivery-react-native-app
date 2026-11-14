import Entypo from "@expo/vector-icons/Entypo";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  /** Hide the trailing chevron (e.g. for Logout). */
  hideChevron?: boolean;
  /** Small orange count bubble before the chevron (e.g. unread items). */
  badge?: number;
};

export default function MenuRow({
  label,
  icon,
  onPress,
  hideChevron,
  badge,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.7}
      onPress={onPress}
      className="min-h-[44px] flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          {icon}
        </View>
        <Text className="text-base text-secondary">{label}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        {!!badge && badge > 0 && (
          <View className="h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5">
            <Text className="text-xs font-bold text-white">{badge}</Text>
          </View>
        )}
        {!hideChevron && (
          <Entypo name="chevron-small-right" size={24} color="#747783" />
        )}
      </View>
    </TouchableOpacity>
  );
}
