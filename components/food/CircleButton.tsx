import React, { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  /** Navy circle with white content (cart, search). Default is light grey. */
  dark?: boolean;
  /** White circle, used over photos. */
  white?: boolean;
  children: ReactNode;
};

export default function CircleButton({
  label,
  onPress,
  dark,
  white,
  children,
}: Props) {
  const bg = dark ? "bg-navy" : white ? "bg-white" : "bg-[#ECF0F4]";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.8}
      hitSlop={6}
      onPress={onPress}
      className={`h-[45px] w-[45px] items-center justify-center rounded-full ${bg}`}
    >
      {children}
    </TouchableOpacity>
  );
}
