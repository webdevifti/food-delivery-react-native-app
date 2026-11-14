import {
  Food,
  recentKeywords,
  searchFoods,
  searchRestaurants,
} from "@/assets/data/food";
import CartButton from "@/components/food/CartButton";
import FoodCard from "@/components/food/FoodCard";
import MiniCart, { MINI_CART_SPACE } from "@/components/food/MiniCart";
import SearchBar from "@/components/food/SearchBar";
import BackButton from "@/components/ui/BackButton";
import Feather from "@expo/vector-icons/Feather";
import { useCart } from "@/context/CartContext";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_SUGGESTIONS = 4;

export default function Search() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(q ?? "");
  const [recent, setRecent] = useState(recentKeywords);
  const { count } = useCart();

  const restaurantResults = searchRestaurants(query);
  const foodResults = searchFoods(query);
  const hasQuery = query.trim().length > 0;
  const noResults =
    hasQuery && restaurantResults.length === 0 && foodResults.length === 0;

  const remember = () => {
    const term = query.trim();
    if (!term) return;
    setRecent((list) => [
      term,
      ...list.filter((k) => k.toLowerCase() !== term.toLowerCase()),
    ]);
  };

  const openFood = (food: Food) =>
    router.push({ pathname: "/(main)/food/[id]", params: { id: food.id } });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-6 pb-4 pt-3">
        <View className="flex-row items-center gap-4">
          <BackButton />
          <Text accessibilityRole="header" className="text-base text-secondary">
            Search
          </Text>
        </View>
        <CartButton />
      </View>

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: count > 0 ? MINI_CART_SPACE + 16 : 32 }}
        >
          <View className="px-6">
            <SearchBar
              autoFocus
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery("")}
              onSubmitEditing={remember}
            />
          </View>

          <Text className="mt-6 px-6 text-xl text-secondary">
            Recent Keywords
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 14,
              gap: 10,
            }}
          >
            {recent.map((keyword) => (
              <TouchableOpacity
                key={keyword}
                accessibilityRole="button"
                accessibilityLabel={`Search ${keyword}`}
                activeOpacity={0.8}
                onPress={() => setQuery(keyword)}
                className="h-[46px] items-center justify-center rounded-full border-2 border-[#EDEDED] bg-white px-6"
              >
                <Text className="text-sm text-secondary">{keyword}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {noResults ? (
            <View className="items-center px-10 pt-16">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-surface">
                <Feather name="search" size={30} color="#A0A5BA" />
              </View>
              <Text className="mt-5 text-lg font-semibold text-secondary">
                No results found
              </Text>
              <Text className="mt-1 text-center text-base text-textLight">
                Nothing matches “{query.trim()}”. Try another keyword.
              </Text>
            </View>
          ) : (
            <>
              {restaurantResults.length > 0 && (
                <View className="mt-4 px-6">
                  <Text className="mb-3 text-xl text-secondary">
                    Suggested Restaurants
                  </Text>
                  {restaurantResults.slice(0, MAX_SUGGESTIONS).map((r, i, arr) => (
                    <TouchableOpacity
                      key={r.id}
                      accessibilityRole="button"
                      accessibilityLabel={r.name}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push({
                          pathname: "/(main)/restaurant/[id]",
                          params: { id: r.id },
                        })
                      }
                      className={`flex-row items-center gap-3 py-3 ${
                        i < arr.length - 1 ? "border-b border-[#EBEBEB]" : ""
                      }`}
                    >
                      <Image
                        source={{ uri: r.image }}
                        contentFit="cover"
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: 8,
                          backgroundColor: "#ECF0F4",
                        }}
                      />
                      <View className="flex-1">
                        <Text numberOfLines={1} className="text-base text-secondary">
                          {r.name}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-1.5">
                          <Feather name="star" size={16} color="#FF7622" />
                          <Text className="text-sm text-secondary">
                            {r.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {foodResults.length > 0 && (
                <>
                  <Text className="mt-6 px-6 text-xl text-secondary">
                    Popular Fast Food
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingHorizontal: 24,
                      paddingBottom: 24,
                      gap: 16,
                    }}
                  >
                    {foodResults.map((f) => (
                      <FoodCard
                        key={f.id}
                        food={f}
                        width={160}
                        onPress={() => openFood(f)}
                      />
                    ))}
                  </ScrollView>
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <MiniCart />
    </SafeAreaView>
  );
}
