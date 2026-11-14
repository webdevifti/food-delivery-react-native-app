import { getRestaurant } from "@/assets/data/food";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StarRating from "@/components/ui/StarRating";
import Screen from "@/components/ui/Screen";
import { useAccount } from "@/context/AccountContext";
import { showAlert } from "@/utils/alerts";
import { formatOrderDate } from "@/utils/orders";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function UserReviews() {
  const { reviews, deleteReview } = useAccount();
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const confirmDelete = (id: string, name: string) =>
    showAlert("Delete review", `Remove your review of ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteReview(id) },
    ]);

  return (
    <Screen title="User Reviews">
      {reviews.length === 0 ? (
        <View className="items-center px-6 pt-20">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
            <Feather name="message-square" size={38} color="#A0A5BA" />
          </View>
          <Text className="mt-6 text-lg font-semibold text-secondary">
            No reviews yet
          </Text>
          <Text className="mt-1 text-center text-base text-textLight">
            Rate a completed order from My Orders to share your experience.
          </Text>
          <PrimaryButton
            title="Go to my orders"
            className="mt-8 w-full"
            onPress={() => router.push("/(main)/orders")}
          />
        </View>
      ) : (
        <>
          <View className="mb-5 flex-row items-center gap-5 rounded-2xl bg-surface p-5">
            <Text className="text-[40px] font-bold text-secondary">
              {average.toFixed(1)}
            </Text>
            <View>
              <StarRating value={average} size={20} />
              <Text className="mt-1 text-sm text-textLight">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Text>
            </View>
          </View>

          {reviews.map((r) => {
            const restaurant = getRestaurant(r.restaurantId);
            const name = restaurant?.shortName ?? "Restaurant";
            return (
              <View key={r.id} className="mb-4 rounded-2xl bg-surface p-5">
                <View className="flex-row items-center gap-4">
                  <Image
                    source={{ uri: restaurant?.image }}
                    contentFit="cover"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      backgroundColor: "#ECF0F4",
                    }}
                  />
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-base font-bold text-secondary"
                    >
                      {name}
                    </Text>
                    <Text className="mt-0.5 text-xs text-muted">
                      {formatOrderDate(r.createdAt)}
                    </Text>
                  </View>
                  {r.orderId && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Edit review of ${name}`}
                      hitSlop={10}
                      onPress={() =>
                        router.push({
                          pathname: "/(main)/rate/[orderId]",
                          params: { orderId: r.orderId! },
                        })
                      }
                      className="mr-4"
                    >
                      <Feather name="edit-2" size={18} color="#FB6F3D" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Delete review of ${name}`}
                    hitSlop={10}
                    onPress={() => confirmDelete(r.id, name)}
                  >
                    <Feather name="trash-2" size={18} color="#E5484D" />
                  </TouchableOpacity>
                </View>
                <View className="mt-4 flex-row flex-wrap items-center gap-x-6 gap-y-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-textLight">Food</Text>
                    <StarRating value={r.rating} />
                  </View>
                  {!!r.deliveryRating && (
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-textLight">Delivery</Text>
                      <StarRating value={r.deliveryRating} />
                    </View>
                  )}
                </View>
                {!!r.tags?.length && (
                  <View className="mt-3 flex-row flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <View
                        key={t}
                        className="rounded-full bg-white px-3 py-1.5"
                      >
                        <Text className="text-xs text-secondary">{t}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {!!r.comment && (
                  <Text className="mt-2 text-sm leading-6 text-textLight">
                    {r.comment}
                  </Text>
                )}
              </View>
            );
          })}
        </>
      )}
    </Screen>
  );
}
