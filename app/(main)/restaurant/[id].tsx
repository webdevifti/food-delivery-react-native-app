import {
  categories,
  emptyFilters,
  Filters,
  foodMatches,
  foodsOfRestaurant,
  getRestaurant,
  hasActiveFilters,
} from "@/assets/data/food";
import CartButton from "@/components/food/CartButton";
import CircleButton from "@/components/food/CircleButton";
import FilterModal from "@/components/food/FilterModal";
import FoodCard from "@/components/food/FoodCard";
import MiniCart, { MINI_CART_SPACE } from "@/components/food/MiniCart";
import MetaRow from "@/components/food/MetaRow";
import BackButton from "@/components/ui/BackButton";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GUTTER = 24;
const GAP = 16;
const DESCRIPTION =
  "Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.";

export default function RestaurantView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = getRestaurant(id);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { addItem, count } = useCart();
  const { isFavouriteRestaurant, toggleFavouriteRestaurant } = useAccount();

  const [slide, setSlide] = useState(0);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!restaurant) {
    return (
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-1 bg-white px-6"
      >
        <StatusBar style="dark" />
        <BackButton />
        <Text className="mt-20 text-center text-lg text-textLight">
          This restaurant couldn&apos;t be found.
        </Text>
      </View>
    );
  }

  const allFoods = foodsOfRestaurant(restaurant.id);
  const matching = allFoods.filter((f) => foodMatches(f, filters));
  // Chips = categories this restaurant actually serves.
  const chips = categories.filter(
    (c) => c.id !== "all" && allFoods.some((f) => f.categoryId === c.id),
  );
  const activeCategory =
    chips.find((c) => c.id === selectedCategory)?.id ?? chips[0]?.id;
  const shown = matching.filter((f) => f.categoryId === activeCategory);
  const cardWidth = Math.floor((width - GUTTER * 2 - GAP) / 2);
  const heroHeight = 320;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setSlide(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            (count > 0 ? MINI_CART_SPACE + 16 : 32) + insets.bottom,
        }}
      >
        {/* Photo carousel */}
        <View
          style={{
            height: heroHeight,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: "hidden",
            backgroundColor: "#ECF0F4",
          }}
        >
          <FlatList
            data={restaurant.gallery}
            keyExtractor={(uri, i) => `${i}-${uri}`}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                contentFit="cover"
                transition={200}
                style={{ width, height: heroHeight }}
              />
            )}
          />
          <View
            pointerEvents="none"
            className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center gap-3"
          >
            {restaurant.gallery.map((_, i) => (
              <View
                key={i}
                className={`rounded-full ${
                  i === slide
                    ? "h-3 w-3 border-2 border-navy/60 bg-white"
                    : "h-2.5 w-2.5 bg-white/50"
                }`}
              />
            ))}
          </View>
        </View>

        <View
          style={{ top: insets.top + 12 }}
          className="absolute left-6 right-6 flex-row items-center justify-between"
        >
          <BackButton dark />
          <View className="flex-row items-center gap-3">
            <CartButton />
            <View>
              <CircleButton
                white
                label="Filter dishes"
                onPress={() => setFilterOpen(true)}
              >
                <Feather name="more-horizontal" size={22} color="#181C2E" />
              </CircleButton>
              {hasActiveFilters(filters) && (
                <View
                  pointerEvents="none"
                  className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-primary"
                />
              )}
            </View>
          </View>
        </View>

        <View className="px-6 pt-6">
          <MetaRow
            rating={restaurant.rating}
            deliveryFee={restaurant.deliveryFee}
            time={restaurant.time}
          />
          <View className="mt-5 flex-row items-center justify-between gap-3">
            <Text
              accessibilityRole="header"
              className="flex-1 text-xl font-bold text-secondary"
            >
              {restaurant.name}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                isFavouriteRestaurant(restaurant.id)
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              accessibilityState={{
                selected: isFavouriteRestaurant(restaurant.id),
              }}
              hitSlop={8}
              onPress={() => toggleFavouriteRestaurant(restaurant.id)}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface"
            >
              {isFavouriteRestaurant(restaurant.id) ? (
                <AntDesign name="heart" size={18} color="#FF7622" />
              ) : (
                <Feather name="heart" size={18} color="#A0A5BA" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-sm leading-6 text-muted">
            {DESCRIPTION}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            gap: 10,
          }}
        >
          {chips.map((c) => {
            const active = c.id === activeCategory;
            return (
              <TouchableOpacity
                key={c.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(c.id)}
                className={`h-[52px] items-center justify-center rounded-full border-2 px-6 ${
                  active
                    ? "border-[#F58D1D] bg-[#F58D1D]"
                    : "border-[#EDEDED] bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${active ? "font-semibold text-white" : "text-secondary"}`}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text className="px-6 text-xl text-secondary">
          {chips.find((c) => c.id === activeCategory)?.name ?? "Dishes"} (
          {shown.length})
        </Text>

        {shown.length === 0 ? (
          <View className="items-center px-10 pb-6 pt-10">
            <Text className="text-center text-base text-textLight">
              {hasActiveFilters(filters)
                ? "No dishes match your filters."
                : "No dishes here yet."}
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
            {shown.map((f) => (
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
    </View>
  );
}
