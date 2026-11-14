import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  /** White circle with dark icon (over photos / dark heroes). */
  dark?: boolean;
  /** Translucent circle with white icon (on navy screens). */
  glass?: boolean;
  /** "close" shows an X, for modal-style screens. */
  icon?: "back" | "close";
};

/** Round back button. Renders nothing when there is no screen to go back to. */
export default function BackButton({ dark, glass, icon = "back" }: Props) {
  if (!router.canGoBack()) return null;

  const bg = glass ? "bg-white/10" : dark ? "bg-white" : "bg-surface";
  const color = glass ? "#FFFFFF" : "#181C2E";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={icon === "close" ? "Close" : "Go back"}
      hitSlop={8}
      onPress={() => router.back()}
      className={`h-[45px] w-[45px] items-center justify-center rounded-full ${bg}`}
    >
      {icon === "close" ? (
        <Feather name="x" size={20} color={color} />
      ) : (
        <Entypo name="chevron-small-left" size={26} color={color} />
      )}
    </TouchableOpacity>
  );
}
