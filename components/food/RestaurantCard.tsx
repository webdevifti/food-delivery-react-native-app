import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Restaurant } from "@/assets/data/food";
import { useAccount } from "@/context/AccountContext";
import MetaRow from "./MetaRow";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  const { isFavouriteRestaurant, toggleFavouriteRestaurant } = useAccount();
  const favourite = isFavouriteRestaurant(restaurant.id);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={restaurant.name}
      activeOpacity={0.9}
      onPress={onPress}
      className="mb-6"
    >
      <View>
        <Image
          source={{ uri: restaurant.image }}
          contentFit="cover"
          transition={200}
          style={{
            width: "100%",
            height: 136,
            borderRadius: 12,
            backgroundColor: "#ECF0F4",
          }}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            favourite
              ? `Remove ${restaurant.name} from favourites`
              : `Add ${restaurant.name} to favourites`
          }
          accessibilityState={{ selected: favourite }}
          hitSlop={8}
          onPress={() => toggleFavouriteRestaurant(restaurant.id)}
          className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-white"
        >
          {favourite ? (
            <AntDesign name="heart" size={18} color="#FF7622" />
          ) : (
            <Feather name="heart" size={18} color="#A0A5BA" />
          )}
        </TouchableOpacity>
      </View>
      <Text className="mt-4 text-xl text-secondary">{restaurant.name}</Text>
      <Text className="mb-3 mt-1 text-sm text-muted">
        {restaurant.tags.join(" - ")}
      </Text>
      <MetaRow
        rating={restaurant.rating}
        deliveryFee={restaurant.deliveryFee}
        time={restaurant.time}
      />
    </TouchableOpacity>
  );
}
