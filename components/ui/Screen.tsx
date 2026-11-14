import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";

type Props = {
  title: string;
  children: ReactNode;
  /** Element shown at the right of the header (e.g. an Edit link). */
  right?: ReactNode;
  /** Sticky area pinned under the content (e.g. the primary action). */
  footer?: ReactNode;
  /** Shows an X instead of the back chevron. */
  closeButton?: boolean;
};

/** Standard white screen: header with back button + title, scrollable body. */
export default function Screen({
  title,
  children,
  right,
  footer,
  closeButton,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
        <View className="flex-1 flex-row items-center gap-4">
          <BackButton icon={closeButton ? "close" : "back"} />
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            className="flex-1 text-xl font-semibold text-secondary"
          >
            {title}
          </Text>
        </View>
        {right}
      </View>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 24,
          }}
        >
          {children}
        </ScrollView>
        {footer ? <View className="px-5 pb-4 pt-2">{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
