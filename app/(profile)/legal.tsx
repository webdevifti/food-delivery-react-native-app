import { legal } from "@/assets/data/account";
import Screen from "@/components/ui/Screen";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

/** Terms & Conditions / Privacy Policy, picked with `?doc=terms|privacy`. */
export default function Legal() {
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  const content = doc === "privacy" ? legal.privacy : legal.terms;

  return (
    <Screen title={content.title}>
      <Text className="mb-5 text-sm text-muted">Last updated: January 2026</Text>
      {content.sections.map((s) => (
        <View key={s.heading} className="mb-5">
          <Text className="text-base font-bold text-secondary">{s.heading}</Text>
          <Text className="mt-2 text-sm leading-6 text-textLight">{s.body}</Text>
        </View>
      ))}
    </Screen>
  );
}
