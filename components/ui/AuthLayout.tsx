import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./BackButton";

type Props = {
  title: string;
  /** Plain text, or nodes (e.g. a bold email) rendered inside the subtitle. */
  subtitle: ReactNode;
  /** Login is the root of the stack, so it hides the back button. */
  showBack?: boolean;
  children: ReactNode;
};

/**
 * Shared shell for the auth screens: navy hero (~30% of the screen) on top and
 * a white, rounded form sheet that fills the rest. Scrolls and avoids the
 * keyboard so fields are never hidden.
 */
export default function AuthLayout({
  title,
  subtitle,
  showBack = true,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(210, Math.round(height * 0.3));

  return (
    <View className="flex-1 bg-navy">
      <StatusBar style="light" />
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ImageBackground
            source={require("@/assets/images/auth-bg.png")}
            resizeMode="cover"
            style={{ height: heroHeight }}
          >
            {showBack && (
              <View
                style={{ top: insets.top + 8 }}
                className="absolute left-6 z-10"
              >
                <BackButton dark />
              </View>
            )}
            <View
              style={{ paddingTop: insets.top }}
              className="flex-1 items-center justify-center px-8"
            >
              <Text
                accessibilityRole="header"
                className="text-center text-[30px] font-bold text-white"
              >
                {title}
              </Text>
              <Text className="mt-2 text-center text-base leading-6 text-white/80">
                {subtitle}
              </Text>
            </View>
          </ImageBackground>
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
            className="flex-1 rounded-t-[24px] bg-white px-6 pt-8"
          >
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
