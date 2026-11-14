import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type Props = {
  /** When set, renders a tappable fake field (home screen) instead of an input. */
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
} & Pick<TextInputProps, "autoFocus" | "onSubmitEditing">;

const DEFAULT_PLACEHOLDER = "Search dishes, restaurants";

export default function SearchBar({
  onPress,
  value = "",
  onChangeText,
  onClear,
  autoFocus,
  onSubmitEditing,
  placeholder = DEFAULT_PLACEHOLDER,
}: Props) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        onPress={onPress}
        className="h-[62px] flex-row items-center gap-3 rounded-[10px] bg-[#F6F6F6] px-5"
      >
        <Feather name="search" size={22} color="#A0A5BA" />
        <Text className="text-sm text-textLight">{placeholder}</Text>
      </Pressable>
    );
  }

  return (
    <View className="h-[62px] flex-row items-center gap-3 rounded-[10px] bg-[#F6F6F6] px-5">
      <Feather name="search" size={22} color="#A0A5BA" />
      <TextInput
        accessibilityLabel="Search"
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#A0A5BA"
        selectionColor="#FF7622"
        returnKeyType="search"
        autoCorrect={false}
        className="flex-1 text-sm text-secondary"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          onPress={onClear}
        >
          <AntDesign name="close-circle" size={20} color="#C4C8D4" />
        </Pressable>
      )}
    </View>
  );
}
