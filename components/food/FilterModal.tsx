import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  emptyFilters,
  Filters,
  offerOptions,
  priceOptions,
  timeOptions,
} from "@/assets/data/food";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Props = {
  visible: boolean;
  initial: Filters;
  onClose: () => void;
  onApply: (filters: Filters) => void;
};

function Label({ children }: { children: string }) {
  return (
    <Text className="mb-3 mt-6 text-[13px] uppercase tracking-wide text-secondary">
      {children}
    </Text>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      activeOpacity={0.8}
      onPress={onPress}
      className={`h-[46px] items-center justify-center rounded-full border-2 px-5 ${
        active ? "border-primary bg-primary" : "border-[#EDEDED] bg-white"
      }`}
    >
      <Text
        className={`text-sm ${active ? "font-semibold text-white" : "text-secondary"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** "Filter your search" popup: offers, delivery time, pricing and rating. */
export default function FilterModal({
  visible,
  initial,
  onClose,
  onApply,
}: Props) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    if (visible) setDraft(initial);
  }, [visible, initial]);

  const toggleOffer = (offer: Filters["offers"][number]) =>
    setDraft((d) => ({
      ...d,
      offers: d.offers.includes(offer)
        ? d.offers.filter((o) => o !== offer)
        : [...d.offers, offer],
    }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close filters"
        onPress={onClose}
        className="flex-1 items-center justify-center bg-secondary/60 px-6"
      >
        <Pressable
          onPress={() => {}}
          className="max-h-[92%] w-full max-w-[440px] rounded-3xl bg-white"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                accessibilityRole="header"
                className="text-base text-secondary"
              >
                Filter your search
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                onPress={onClose}
                className="h-[45px] w-[45px] items-center justify-center rounded-full bg-surface"
              >
                <Feather name="x" size={20} color="#181C2E" />
              </TouchableOpacity>
            </View>

            <Label>Offers</Label>
            <View className="flex-row flex-wrap gap-3">
              {offerOptions.map((o) => (
                <Chip
                  key={o}
                  label={o}
                  active={draft.offers.includes(o)}
                  onPress={() => toggleOffer(o)}
                />
              ))}
            </View>

            <Label>Deliver time</Label>
            <View className="flex-row flex-wrap gap-3">
              {timeOptions.map((t) => (
                <Chip
                  key={t.max}
                  label={t.label}
                  active={draft.maxTime === t.max}
                  onPress={() =>
                    setDraft((d) => ({
                      ...d,
                      maxTime: d.maxTime === t.max ? null : t.max,
                    }))
                  }
                />
              ))}
            </View>

            <Label>Pricing</Label>
            <View className="flex-row gap-3">
              {priceOptions.map((level) => {
                const active = draft.price === level;
                return (
                  <TouchableOpacity
                    key={level}
                    accessibilityRole="button"
                    accessibilityLabel={`Price level ${level}`}
                    accessibilityState={{ selected: active }}
                    activeOpacity={0.8}
                    onPress={() =>
                      setDraft((d) => ({
                        ...d,
                        price: d.price === level ? null : level,
                      }))
                    }
                    className={`h-[46px] w-[46px] items-center justify-center rounded-full border-2 ${
                      active
                        ? "border-primary bg-primary"
                        : "border-[#EDEDED] bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm ${active ? "font-semibold text-white" : "text-secondary"}`}
                    >
                      {"$".repeat(level)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Label>Rating</Label>
            <View className="flex-row gap-3">
              {[1, 2, 3, 4, 5].map((n) => {
                const on = n <= draft.rating;
                return (
                  <TouchableOpacity
                    key={n}
                    accessibilityRole="button"
                    accessibilityLabel={`${n} stars and up`}
                    accessibilityState={{ selected: on }}
                    activeOpacity={0.8}
                    onPress={() =>
                      setDraft((d) => ({
                        ...d,
                        rating: d.rating === n ? 0 : n,
                      }))
                    }
                    className="h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-[#EDEDED] bg-white"
                  >
                    <Feather
                      name="star"
                      size={20}
                      color={on ? "#FF7622" : "#C9CCD6"}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <PrimaryButton
              title="Filter"
              className="mt-8"
              onPress={() => onApply(draft)}
            />
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setDraft(emptyFilters)}
              className="items-center pt-4"
            >
              <Text className="text-sm font-semibold text-textLight">
                Reset filters
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
