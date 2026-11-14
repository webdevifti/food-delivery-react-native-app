import {
  formatPrice,
  getFood,
  getRestaurant,
  IngredientKey,
  sizes,
} from "@/assets/data/food";
import CartButton from "@/components/food/CartButton";
import MetaRow from "@/components/food/MetaRow";
import CircleButton from "@/components/food/CircleButton";
import BackButton from "@/components/ui/BackButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const INGREDIENT_ICONS: Record<
  IngredientKey,
  { icon: IconName; label: string }
> = {
  salt: { icon: "shaker-outline", label: "Salt" },
  chicken: { icon: "food-drumstick-outline", label: "Chicken" },
  beef: { icon: "food-steak", label: "Beef" },
  cheese: { icon: "cheese", label: "Cheese" },
  herbs: { icon: "leaf", label: "Herbs" },
  chili: { icon: "chili-mild-outline", label: "Chili" },
  egg: { icon: "egg-outline", label: "Egg" },
  mushroom: { icon: "mushroom-outline", label: "Mushroom" },
  fish: { icon: "fish", label: "Fish" },
};

const MAX_QTY = 20;

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const food = getFood(id);
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { isFavourite, toggleFavourite } = useAccount();

  const [size, setSize] = useState(sizes[1] ?? sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!food) {
    return (
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-1 bg-white px-6"
      >
        <StatusBar style="dark" />
        <BackButton />
        <Text className="mt-20 text-center text-lg text-textLight">
          This dish couldn&apos;t be found.
        </Text>
      </View>
    );
  }

  const restaurant = getRestaurant(food.restaurantId);
  const unitPrice = Math.round(food.price * size.multiplier);
  const total = unitPrice * qty;

  const handleAdd = () => {
    addItem({ foodId: food.id, size: size.label, qty, unitPrice });
    setAdded(true);
    timer.current = setTimeout(() => router.back(), 700);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 230 + insets.bottom }}
      >
        {/* Hero */}
        <View
          style={{
            height: 320 + insets.top * 0.5,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: "hidden",
            backgroundColor: "#FFBA6A",
          }}
        >
          <Image
            source={{ uri: food.image }}
            contentFit="cover"
            transition={250}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View
          style={{ top: insets.top + 12 }}
          className="absolute left-6 right-6 flex-row items-center justify-between"
        >
          <BackButton dark />
          <View className="flex-row items-center gap-3">
            <CartButton />
            <CircleButton
              white
              label={
                isFavourite(food.id)
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              onPress={() => toggleFavourite(food.id)}
            >
              {isFavourite(food.id) ? (
                <AntDesign name="heart" size={20} color="#FF7622" />
              ) : (
                <Feather name="heart" size={20} color="#A0A5BA" />
              )}
            </CircleButton>
          </View>
        </View>

        <View className="px-6 pt-6">
          <Text
            accessibilityRole="header"
            className="text-xl font-bold text-secondary"
          >
            {food.name}
          </Text>
          {restaurant && (
            <View className="mt-3 flex-row items-center gap-2">
              <Image
                source={{ uri: restaurant.image }}
                contentFit="cover"
                style={{ width: 24, height: 24, borderRadius: 12 }}
              />
              <Text className="text-sm text-secondary">
                {restaurant.shortName}
              </Text>
            </View>
          )}

          <View className="mt-5">
            <MetaRow
              rating={food.rating}
              deliveryFee={food.deliveryFee}
              time={food.time}
            />
          </View>

          <Text className="mt-5 text-sm leading-6 text-muted">
            {food.description}
          </Text>

          <View className="mt-6 flex-row items-center gap-4">
            <Text className="text-[13px] uppercase tracking-wide text-muted">
              Size:
            </Text>
            <View className="flex-row gap-3">
              {sizes.map((s) => {
                const active = s.label === size.label;
                return (
                  <TouchableOpacity
                    key={s.label}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Size ${s.label}`}
                    activeOpacity={0.8}
                    onPress={() => setSize(s)}
                    className={`h-12 w-12 items-center justify-center rounded-full ${
                      active ? "bg-[#F58D1D]" : "bg-field"
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        active ? "text-white" : "text-secondary"
                      }`}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text className="mt-6 text-[13px] uppercase tracking-wide text-secondary">
            Ingredients
          </Text>
          <View className="mt-3 flex-row gap-3">
            {food.ingredients.map((key) => {
              const ing = INGREDIENT_ICONS[key];
              return (
                <View
                  key={key}
                  accessible
                  accessibilityLabel={ing.label}
                  className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#FFEBE4]"
                >
                  <MaterialCommunityIcons
                    name={ing.icon}
                    size={22}
                    color="#FF7622"
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky order bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-field px-6 pt-6"
      >
        <View className="flex-row items-center justify-between">
          <Text
            accessibilityLabel={`Total ${formatPrice(total)}`}
            className="text-[32px] text-secondary"
          >
            {formatPrice(total)}
          </Text>
          <View className="h-[48px] flex-row items-center gap-4 rounded-full bg-navy px-2">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              disabled={qty <= 1}
              hitSlop={6}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              className={`h-8 w-8 items-center justify-center rounded-full bg-white/25 ${
                qty <= 1 ? "opacity-50" : ""
              }`}
            >
              <Feather name="minus" size={16} color="white" />
            </TouchableOpacity>
            <Text
              accessibilityLiveRegion="polite"
              className="min-w-[16px] text-center text-base font-bold text-white"
            >
              {qty}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              disabled={qty >= MAX_QTY}
              hitSlop={6}
              onPress={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              className={`h-8 w-8 items-center justify-center rounded-full bg-white/25 ${
                qty >= MAX_QTY ? "opacity-50" : ""
              }`}
            >
              <Feather name="plus" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <PrimaryButton
          title={added ? "Added to cart" : "Add to cart"}
          onPress={handleAdd}
          disabled={added}
          className="mt-5"
        />
      </View>
    </View>
  );
}
