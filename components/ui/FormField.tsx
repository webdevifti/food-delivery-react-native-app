import AntDesign from "@expo/vector-icons/AntDesign";
import React, { ReactNode, Ref, useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Renders a password field with a show/hide toggle. */
  password?: boolean;
  containerClassName?: string;
  /** Optional icon shown inside the field, left of the text. */
  icon?: ReactNode;
  ref?: Ref<TextInput>;
};

export default function FormField({
  label,
  error,
  password,
  containerClassName = "mb-6",
  icon,
  multiline,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const borderClass = error
    ? "border-danger"
    : focused
      ? "border-primary"
      : "border-transparent";

  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-[13px] uppercase tracking-wide text-secondary">
        {label}
      </Text>
      <View
        className={`flex-row rounded-[10px] border bg-field px-5 ${borderClass} ${
          multiline ? "items-start" : "items-center"
        }`}
      >
        {icon ? <View className="mr-3">{icon}</View> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor="#A0A5BA"
          selectionColor="#FF7622"
          secureTextEntry={password && !visible}
          autoCapitalize={password ? "none" : inputProps.autoCapitalize}
          autoCorrect={password ? false : inputProps.autoCorrect}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={`flex-1 text-base text-secondary ${
            multiline ? "min-h-[120px] py-4" : "min-h-[60px] py-3"
          }`}
          {...inputProps}
        />
        {password && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            hitSlop={10}
            onPress={() => setVisible((v) => !v)}
            className="pl-3"
          >
            <AntDesign
              name={visible ? "eye" : "eye-invisible"}
              size={22}
              color="#A0A5BA"
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <Text accessibilityRole="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </Text>
      )}
    </View>
  );
}
