import { getFood, getRestaurant } from "@/assets/data/food";
import FoodCard from "@/components/food/FoodCard";
import RestaurantCard from "@/components/food/RestaurantCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

const SCREEN_PADDING = 20;
const GAP = 16;

type Tab = "dishes" | "restaurants";

function Empty({ icon, title, hint }: { icon: keyof typeof Feather.glyphMap; title: string; hint: string }) {
  return (
    <View className="items-center px-6 pt-16">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
        <Feather name={icon} size={38} color="#A0A5BA" />
      </View>
      <Text className="mt-6 text-lg font-semibold text-secondary">{title}</Text>
      <Text className="mt-1 text-center text-base text-textLight">{hint}</Text>
      <PrimaryButton
        title="Browse food"
        className="mt-8 w-full"
        onPress={() => router.push("/(main)/home")}
      />
    </View>
  );
}

export default function Favourites() {
  const { favourites, favouriteRestaurants } = useAccount();
  const { addItem } = useCart();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>("dishes");
  const cardWidth = Math.floor((width - SCREEN_PADDING * 2 - GAP) / 2);

  const dishes = favourites.map((id) => getFood(id)).filter((f) => !!f);
  const restaurants = favouriteRestaurants
    .map((id) => getRestaurant(id))
    .filter((r) => !!r);

  return (
    <Screen title="Favourite">
      <View accessibilityRole="tablist" className="mb-2 flex-row rounded-full bg-surface p-1">
        {(["dishes", "restaurants"] as const).map((t) => {
          const active = t === tab;
          const count = t === "dishes" ? dishes.length : restaurants.length;
          return (
            <TouchableOpacity
              key={t}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              activeOpacity={0.85}
              onPress={() => setTab(t)}
              className={`h-11 flex-1 items-center justify-center rounded-full ${active ? "bg-primary" : ""}`}
            >
              <Text className={`text-sm ${active ? "font-bold text-white" : "text-textLight"}`}>
                {t === "dishes" ? "Dishes" : "Restaurants"} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tab === "dishes" ? (
        dishes.length === 0 ? (
          <Empty
            icon="heart"
            title="No favourite dishes yet"
            hint="Tap the heart on any dish to save it here."
          />
        ) : (
          <View style={{ columnGap: GAP }} className="flex-row flex-wrap">
            {dishes.map((f) => (
              <FoodCard
                key={f!.id}
                food={f!}
                width={cardWidth}
                onPress={() =>
                  router.push({ pathname: "/(main)/food/[id]", params: { id: f!.id } })
                }
                onAdd={() =>
                  addItem({ foodId: f!.id, size: '14"', qty: 1, unitPrice: f!.price })
                }
              />
            ))}
          </View>
        )
      ) : restaurants.length === 0 ? (
        <Empty
          icon="heart"
          title="No favourite restaurants yet"
          hint="Tap the heart on a restaurant to save it here."
        />
      ) : (
        <View className="pt-5">
          {restaurants.map((r) => (
            <RestaurantCard
              key={r!.id}
              restaurant={r!}
              onPress={() =>
                router.push({ pathname: "/(main)/restaurant/[id]", params: { id: r!.id } })
              }
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
