import {
  categories,
  restaurantsInCategory,
} from "@/assets/data/food";
import CartButton from "@/components/food/CartButton";
import CategoryChip from "@/components/food/CategoryChip";
import CircleButton from "@/components/food/CircleButton";
import MiniCart, { MINI_CART_SPACE } from "@/components/food/MiniCart";
import OfferModal from "@/components/food/OfferModal";
import RestaurantCard from "@/components/food/RestaurantCard";
import SearchBar from "@/components/food/SearchBar";
import SectionHeader from "@/components/food/SectionHeader";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Show the offer popup once per app session. */
let offerShown = false;

const INITIAL_RESTAURANTS = 3;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 17) return "Good Afternoon!";
  return "Good Evening!";
};

export default function Home() {
  const { profile, addresses } = useUser();
  const { count } = useCart();
  const [categoryId, setCategoryId] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [offerVisible, setOfferVisible] = useState(!offerShown);

  useEffect(() => {
    offerShown = true;
  }, []);

  const visibleRestaurants = restaurantsInCategory(categoryId);
  const restaurantList = showAll
    ? visibleRestaurants
    : visibleRestaurants.slice(0, INITIAL_RESTAURANTS);

  const deliverTo = addresses[0]?.address ?? "Add an address";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: count > 0 ? MINI_CART_SPACE + 16 : 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-3">
          <CircleButton
            label="Open profile menu"
            onPress={() => router.push("/(profile)/profile")}
          >
            <View className="gap-[5px]">
              <View className="h-[2px] w-[18px] rounded bg-secondary" />
              <View className="h-[2px] w-[11px] rounded bg-secondary" />
            </View>
          </CircleButton>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Deliver to ${deliverTo}`}
            activeOpacity={0.7}
            onPress={() => router.push("/(profile)/addresses")}
            className="flex-1 px-4"
          >
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              Deliver to
            </Text>
            <View className="mt-0.5 flex-row items-center gap-2">
              <Text
                numberOfLines={1}
                className="shrink text-sm text-textLight"
              >
                {deliverTo}
              </Text>
              <AntDesign name="caret-down" size={10} color="#181C2E" />
            </View>
          </TouchableOpacity>
          <CartButton />
        </View>

        <Text className="mt-6 px-6 text-base text-secondary">
          Hey {profile.name.split(" ")[0]},{" "}
          <Text className="font-bold">{greeting()}</Text>
        </Text>

        <View className="mt-5 px-6">
          <SearchBar onPress={() => router.push("/(main)/search")} />
        </View>

        {/* Categories */}
        <View className="mt-6 px-6">
          <SectionHeader
            title="All Categories"
            actionLabel="See All"
            onAction={() =>
              router.push({
                pathname: "/(main)/category",
                params: { category: categoryId },
              })
            }
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 14,
            gap: 12,
          }}
        >
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              category={c}
              active={c.id === categoryId}
              onPress={() => {
                setCategoryId(c.id);
                setShowAll(false);
              }}
            />
          ))}
        </ScrollView>

        {/* Restaurants */}
        <View className="mt-3 px-6">
          <SectionHeader
            title="Open Restaurants"
            actionLabel={
              visibleRestaurants.length > INITIAL_RESTAURANTS
                ? showAll
                  ? "Show Less"
                  : "See All"
                : undefined
            }
            onAction={() => setShowAll((v) => !v)}
          />
          <View className="mt-5">
            {restaurantList.length === 0 ? (
              <Text className="py-10 text-center text-base text-textLight">
                No restaurants open in this category yet.
              </Text>
            ) : (
              restaurantList.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/restaurant/[id]",
                      params: { id: r.id },
                    })
                  }
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <MiniCart />

      <OfferModal
        visible={offerVisible}
        onClose={() => setOfferVisible(false)}
      />
    </SafeAreaView>
  );
}
