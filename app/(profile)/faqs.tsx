import { faqs } from "@/assets/data/account";
import SearchBar from "@/components/food/SearchBar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

const SUPPORT_EMAIL = "support@fooddelivery.example";

export default function Faqs() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const q = query.trim().toLowerCase();
  const list = faqs.filter(
    (f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
  );

  return (
    <Screen title="FAQs">
      <SearchBar
        placeholder="Search help topics"
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
      />

      <View className="mt-6">
        {list.length === 0 ? (
          <Text className="py-10 text-center text-base text-textLight">
            No answers found for “{query.trim()}”.
          </Text>
        ) : (
          list.map((f, i) => {
            const expanded = open === i || !!q;
            return (
              <TouchableOpacity
                key={f.q}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                activeOpacity={0.8}
                onPress={() => setOpen(open === i ? null : i)}
                className="mb-3 rounded-2xl bg-surface p-5"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-base font-semibold text-secondary">
                    {f.q}
                  </Text>
                  <Feather
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#FF7622"
                  />
                </View>
                {expanded && (
                  <Text className="mt-3 text-sm leading-6 text-textLight">
                    {f.a}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View className="mt-4 items-center rounded-2xl border-2 border-[#EDEDED] p-6">
        <Text className="text-base font-bold text-secondary">
          Still need help?
        </Text>
        <Text className="mt-1 text-center text-sm text-textLight">
          Our support team is happy to help.
        </Text>
        <PrimaryButton
          title="Contact support"
          variant="outline"
          className="mt-4 w-full"
          onPress={() =>
            Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Help%20with%20my%20order`)
          }
        />
      </View>
    </Screen>
  );
}
