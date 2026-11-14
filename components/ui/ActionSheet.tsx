import React, { ReactNode } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ActionSheetOption = {
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  title?: string;
  options: ActionSheetOption[];
  onClose: () => void;
};

/** Bottom sheet with a list of actions. Works the same on iOS, Android, web. */
export default function ActionSheet({ visible, title, options, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        className="flex-1 justify-end bg-secondary/60"
      >
        <Pressable
          onPress={() => {}}
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          className="w-full self-center rounded-t-[24px] bg-white px-6 pt-3"
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-[#DDE1E8]" />
          {!!title && (
            <Text className="mb-2 text-center text-base font-bold text-secondary">
              {title}
            </Text>
          )}
          {options.map((o) => (
            <TouchableOpacity
              key={o.label}
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={() => {
                onClose();
                o.onPress();
              }}
              className="min-h-[56px] flex-row items-center gap-4 border-b border-[#F0F0F0]"
            >
              {o.icon ? (
                <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
                  {o.icon}
                </View>
              ) : null}
              <Text
                className={`text-base ${
                  o.destructive ? "text-danger" : "text-secondary"
                }`}
              >
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={onClose}
            className="mt-4 min-h-[56px] items-center justify-center rounded-[10px] bg-surface"
          >
            <Text className="text-sm font-bold uppercase tracking-wider text-secondary">
              Cancel
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
