import React, { ReactNode } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
  /** Optional icon shown in a soft circle at the right edge. */
  rightIcon?: ReactNode;
  className?: string;
};

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  rightIcon,
  className = "",
}: Props) {
  const inactive = disabled || loading;
  const outline = variant === "outline";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      activeOpacity={0.85}
      disabled={inactive}
      onPress={onPress}
      className={`min-h-[62px] items-center justify-center rounded-[10px] px-14 ${
        outline ? "border border-primary bg-white" : "bg-primary"
      } ${inactive ? "opacity-60" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={outline ? "#FF7622" : "#FFFFFF"} />
      ) : (
        <>
          <Text
            className={`text-center text-sm font-bold uppercase tracking-wider ${
              outline ? "text-primary" : "text-white"
            }`}
          >
            {title}
          </Text>
          {rightIcon ? (
            <View className="absolute right-4 h-8 w-8 items-center justify-center rounded-full bg-white/25">
              {rightIcon}
            </View>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}
