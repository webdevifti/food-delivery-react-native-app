import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import StarRating from "@/components/ui/StarRating";
import { useAccount } from "@/context/AccountContext";
import { useOrders } from "@/context/OrdersContext";
import { showAlert } from "@/utils/alerts";
import { itemsLabel, orderImage, orderRestaurant } from "@/utils/orders";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const TAGS = [
  "Tasty",
  "Fresh",
  "Good portion",
  "Value for money",
  "Fast delivery",
  "Good packaging",
  "Friendly courier",
];

function Question({
  title,
  value,
  onChange,
  error,
}: {
  title: string;
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  return (
    <View className="mb-6 items-center">
      <Text className="text-base font-semibold text-secondary">{title}</Text>
      <View className="mt-3">
        <StarRating value={value} onChange={onChange} size={40} gap={6} />
      </View>
      <Text
        className={`mt-2 h-5 text-sm ${error ? "text-danger" : "text-textLight"}`}
        accessibilityRole={error ? "alert" : undefined}
      >
        {error ?? LABELS[value]}
      </Text>
    </View>
  );
}

/** Rate a delivered order (or edit the existing rating). */
export default function RateOrder() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const { reviewFor, addReview, updateReview } = useAccount();
  const order = getOrder(orderId);
  const existing = order ? reviewFor(order.id) : undefined;
  const restaurant = order ? orderRestaurant(order) : undefined;

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [delivery, setDelivery] = useState(existing?.deliveryRating ?? 0);
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [submitted, setSubmitted] = useState(false);

  if (!order || !restaurant) {
    return (
      <Screen title="Rate Order">
        <Text className="mt-20 text-center text-lg text-textLight">
          This order couldn&apos;t be found.
        </Text>
      </Screen>
    );
  }

  if (order.status !== "completed") {
    return (
      <Screen title="Rate Order">
        <Text className="mt-20 text-center text-lg text-textLight">
          You can rate an order once it has been delivered.
        </Text>
      </Screen>
    );
  }

  const toggleTag = (tag: string) =>
    setTags((list) =>
      list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag],
    );

  const handleSubmit = () => {
    setSubmitted(true);
    if (rating === 0) return;
    const data = {
      rating,
      deliveryRating: delivery || undefined,
      tags,
      comment: comment.trim(),
    };
    if (existing) updateReview(existing.id, data);
    else addReview({ restaurantId: restaurant.id, orderId: order.id, ...data });
    showAlert(
      existing ? "Review updated" : "Thanks for your review!",
      "You can find it under Profile > User Reviews.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <Screen
      title={existing ? "Edit Rating" : "Rate Order"}
      footer={
        <PrimaryButton
          title={existing ? "Update review" : "Submit review"}
          onPress={handleSubmit}
        />
      }
    >
      <View className="mb-6 flex-row items-center gap-4 rounded-2xl bg-surface p-4">
        <Image
          source={{ uri: orderImage(order) }}
          contentFit="cover"
          style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#ECF0F4" }}
        />
        <View className="flex-1">
          <Text numberOfLines={1} className="text-base font-bold text-secondary">
            {restaurant.name}
          </Text>
          <Text className="mt-0.5 text-sm text-textLight">
            #{order.id}  •  {itemsLabel(order)}
          </Text>
        </View>
      </View>

      <Question
        title="How was the food?"
        value={rating}
        onChange={setRating}
        error={submitted && rating === 0 ? "Please select a rating" : undefined}
      />
      <Question
        title="How was the delivery?"
        value={delivery}
        onChange={setDelivery}
      />

      <Text className="mb-3 text-[13px] uppercase tracking-wide text-secondary">
        What did you like?
      </Text>
      <View className="mb-6 flex-row flex-wrap gap-3">
        {TAGS.map((t) => {
          const active = tags.includes(t);
          return (
            <TouchableOpacity
              key={t}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              activeOpacity={0.8}
              onPress={() => toggleTag(t)}
              className={`h-[42px] items-center justify-center rounded-full border-2 px-4 ${
                active ? "border-primary bg-primary" : "border-[#EDEDED] bg-white"
              }`}
            >
              <Text
                className={`text-sm ${active ? "font-semibold text-white" : "text-secondary"}`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FormField
        label="Comments (optional)"
        placeholder="Tell us more about your experience"
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={200}
        containerClassName="mb-2"
      />
      <Text className="text-right text-xs text-muted">{comment.length}/200</Text>
    </Screen>
  );
}
