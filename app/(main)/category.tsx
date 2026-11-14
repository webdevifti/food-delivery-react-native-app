import {
  categories,
  emptyFilters,
  Filters,
  foodMatches,
  foodsInCategory,
  getCategory,
  hasActiveFilters,
  restaurantMatches,
  restaurantsInCategory,
} from "@/assets/data/food";
import CartButton from "@/components/food/CartButton";
import CircleButton from "@/components/food/CircleButton";
import FilterModal from "@/components/food/FilterModal";
import FoodCard from "@/components/food/FoodCard";
import MiniCart, { MINI_CART_SPACE } from "@/components/food/MiniCart";
import RestaurantCard from "@/components/food/RestaurantCard";
import BackButton from "@/components/ui/BackButton";
import { useCart } from "@/context/CartContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const GUTTER = 24;
const GAP = 16;

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { addItem, count } = useCart();
  const [categoryId, setCategoryId] = useState(
    getCategory(params.category)?.id ?? "burger",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = getCategory(categoryId)!;
  const foodList = foodsInCategory(categoryId)
    .filter((f) => foodMatches(f, filters))
    .sort((a, b) => b.rating - a.rating);
  const restaurantList = restaurantsInCategory(categoryId).filter((r) =>
    restaurantMatches(r, filters),
  );
  const cardWidth = Math.floor((width - GUTTER * 2 - GAP) / 2);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="z-20 flex-row items-center px-6 pb-2 pt-3">
        <BackButton />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Category: ${category.name}`}
          accessibilityState={{ expanded: menuOpen }}
          activeOpacity={0.8}
          onPress={() => setMenuOpen((v) => !v)}
          className="ml-3 h-[45px] flex-row items-center gap-2 rounded-full border-2 border-[#EDEDED] bg-white px-4"
        >
          <Text className="text-xs font-bold uppercase text-secondary">
            {category.name}
          </Text>
          <AntDesign name={menuOpen ? "caret-up" : "caret-down"} size={10} color="#FF7622" />
        </TouchableOpacity>
        <View className="flex-1" />
        <View className="flex-row items-center gap-2">
          <CircleButton
            dark
            label="Search"
            onPress={() => router.push("/(main)/search")}
          >
            <Feather name="search" size={20} color="white" />
          </CircleButton>
          <View>
            <CircleButton label="Filter" onPress={() => setFilterOpen(true)}>
              <Feather name="sliders" size={20} color="#181C2E" />
            </CircleButton>
            {hasActiveFilters(filters) && (
              <View
                pointerEvents="none"
                className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-primary"
              />
            )}
          </View>
          <CartButton />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: count > 0 ? MINI_CART_SPACE + 16 : 32 }}
      >
        <Text
          accessibilityRole="header"
          className="mt-4 px-6 text-xl text-secondary"
        >
          {category.title}
        </Text>

        {foodList.length === 0 ? (
          <View className="items-center px-6 py-10">
            <Text className="text-center text-base text-textLight">
              {hasActiveFilters(filters)
                ? "No dishes match your filters."
                : "Nothing here yet."}
            </Text>
            {hasActiveFilters(filters) && (
              <TouchableOpacity
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setFilters(emptyFilters)}
                className="mt-3"
              >
                <Text className="text-base font-semibold text-primary">
                  Clear filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={{ paddingHorizontal: GUTTER, columnGap: GAP }}
            className="flex-row flex-wrap"
          >
            {foodList.map((f) => (
              <FoodCard
                key={f.id}
                food={f}
                width={cardWidth}
                onPress={() =>
                  router.push({
                    pathname: "/(main)/food/[id]",
                    params: { id: f.id },
                  })
                }
                onAdd={() =>
                  addItem({
                    foodId: f.id,
                    size: '14"',
                    qty: 1,
                    unitPrice: f.price,
                  })
                }
              />
            ))}
          </View>
        )}

        <Text className="mb-5 mt-8 px-6 text-xl text-secondary">
          Open Restaurants
        </Text>
        <View className="px-6">
          {restaurantList.map((r) => (
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
          ))}
        </View>
      </ScrollView>

      <MiniCart />

      <FilterModal
        visible={filterOpen}
        initial={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterOpen(false);
        }}
      />

      {menuOpen && (
        <>
          <Pressable
            accessibilityLabel="Close category menu"
            onPress={() => setMenuOpen(false)}
            className="absolute inset-0 z-30"
          />
          <View
            style={{ top: insets.top + 70 }}
            className="absolute left-[88px] z-40 w-48 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white py-2 shadow-lg"
          >
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: c.id === categoryId }}
                onPress={() => {
                  setCategoryId(c.id);
                  setMenuOpen(false);
                }}
                className="flex-row items-center justify-between px-5 py-3"
              >
                <Text
                  className={`text-sm uppercase ${
                    c.id === categoryId
                      ? "font-bold text-primary"
                      : "text-secondary"
                  }`}
                >
                  {c.name}
                </Text>
                {c.id === categoryId && (
                  <Feather name="check" size={16} color="#FF7622" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
