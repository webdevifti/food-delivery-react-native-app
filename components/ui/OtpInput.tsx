import React, { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
};

/**
 * One-time-code input. A single hidden TextInput receives all typing, pasting
 * and SMS autofill; the visible boxes just mirror its value.
 */
export default function OtpInput({
  value,
  onChange,
  length = 4,
  error,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable
      accessibilityLabel="Verification code"
      onPress={() => inputRef.current?.focus()}
    >
      <View className="flex-row justify-between">
        {Array.from({ length }).map((_, i) => {
          const isActive = focused && i === activeIndex;
          const border = error
            ? "border-danger"
            : isActive
              ? "border-primary"
              : "border-transparent";
          return (
            <View
              key={i}
              className={`h-[60px] w-[60px] items-center justify-center rounded-[10px] border bg-field ${border}`}
            >
              <Text className="text-xl font-bold text-secondary">
                {value[i] ?? ""}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) =>
          onChange(text.replace(/\D/g, "").slice(0, length))
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        className="absolute inset-0 opacity-0"
      />
    </Pressable>
  );
}
