import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Food, formatPrice, getRestaurant } from "@/assets/data/food";
import { useAccount } from "@/context/AccountContext";
import { softShadow } from "./shadow";

const IMAGE = 112;
const OVERLAP = 52;

type Props = {
  food: Food;
  width: number;
  onPress: () => void;
  /** Shows the price and the orange "+" quick-add button. */
  onAdd?: () => void;
};

/**
 * White card with the dish photo overlapping its top edge. Leaves
 * `OVERLAP` px of space above itself for the photo — don't clip the parent.
 */
export default function FoodCard({ food, width, onPress, onAdd }: Props) {
  const { isFavourite, toggleFavourite } = useAccount();
  const favourite = isFavourite(food.id);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    onAdd?.();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 900);
  };

  return (
    <View style={{ width, marginTop: OVERLAP }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={food.name}
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          softShadow,
          {
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            paddingTop: IMAGE - OVERLAP + 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
          },
        ]}
      >
        <Image
          source={{ uri: food.image }}
          contentFit="cover"
          transition={200}
          style={{
            position: "absolute",
            top: -OVERLAP,
            left: (width - IMAGE) / 2,
            width: IMAGE,
            height: IMAGE,
            borderRadius: IMAGE / 2,
            borderWidth: 4,
            borderColor: "#FFFFFF",
            backgroundColor: "#ECF0F4",
          }}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            favourite ? `Remove ${food.name} from favourites` : `Add ${food.name} to favourites`
          }
          accessibilityState={{ selected: favourite }}
          hitSlop={8}
          onPress={() => toggleFavourite(food.id)}
          className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white"
          style={{ zIndex: 2 }}
        >
          {favourite ? (
            <AntDesign name="heart" size={16} color="#FF7622" />
          ) : (
            <Feather name="heart" size={16} color="#A0A5BA" />
          )}
        </TouchableOpacity>
        <Text numberOfLines={1} className="text-[15px] font-bold text-secondary">
          {food.name}
        </Text>
        <Text numberOfLines={1} className="mt-1 text-[13px] text-textLight">
          {getRestaurant(food.restaurantId)?.shortName}
        </Text>
        {onAdd && (
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-secondary">
              {formatPrice(food.price)}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Add ${food.name} to cart`}
              hitSlop={8}
              activeOpacity={0.8}
              onPress={handleAdd}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#F58D1D]"
            >
              <Feather name={added ? "check" : "plus"} size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
