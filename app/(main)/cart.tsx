import { formatPrice, getFood } from "@/assets/data/food";
import PrimaryButton from "@/components/ui/PrimaryButton";
import BackButton from "@/components/ui/BackButton";
import { CartItem, useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { showAlert } from "@/utils/alerts";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function StepButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: "minus" | "plus";
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      className={`h-6 w-6 items-center justify-center rounded-full bg-white/20 ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <Feather name={icon} size={14} color="white" />
    </TouchableOpacity>
  );
}

function CartRow({ item, editing }: { item: CartItem; editing: boolean }) {
  const { setQty, removeItem } = useCart();
  const food = getFood(item.foodId);
  if (!food) return null;

  return (
    <View className="mb-6 flex-row items-center gap-5">
      <View className="h-[116px] w-[132px] items-center justify-center rounded-[26px] bg-white/10">
        <Image
          source={{ uri: food.image }}
          contentFit="cover"
          transition={200}
          style={{ width: 92, height: 92, borderRadius: 46 }}
        />
      </View>
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text numberOfLines={2} className="flex-1 text-base leading-6 text-white">
            {food.name}
          </Text>
          {editing && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Remove ${food.name}`}
              hitSlop={8}
              onPress={() => removeItem(item.foodId, item.size)}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#E04646]"
            >
              <Feather name="x" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Text className="mt-1 text-xl font-bold text-white">
          {formatPrice(item.qty * item.unitPrice)}
        </Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-base text-white/50">{item.size}</Text>
          <View className="flex-row items-center gap-3">
            <StepButton
              icon="minus"
              label={`Decrease ${food.name}`}
              disabled={item.qty <= 1}
              onPress={() => setQty(item.foodId, item.size, item.qty - 1)}
            />
            <Text className="min-w-[14px] text-center text-base font-bold text-white">
              {item.qty}
            </Text>
            <StepButton
              icon="plus"
              label={`Increase ${food.name}`}
              disabled={item.qty >= 20}
              onPress={() => setQty(item.foodId, item.size, item.qty + 1)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function Cart() {
  const { items, total } = useCart();
  const { addresses } = useUser();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);

  const address = addresses[0];
  const addressText = address
    ? [address.address, address.apartment && `Apt ${address.apartment}`, address.street, address.postCode]
        .filter(Boolean)
        .join(", ")
    : "";

  const showBreakdown = () =>
    showAlert(
      "Order breakdown",
      `Subtotal: ${formatPrice(total)}\nDelivery: Free\nDiscount: $0\n\nTotal: ${formatPrice(total)}`,
    );

  return (
    <View className="flex-1 bg-navy">
      <StatusBar style="light" />
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-row items-center justify-between px-6 pb-5 pt-3">
          <View className="flex-row items-center gap-4">
            <BackButton glass />
            <Text accessibilityRole="header" className="text-base text-white">
              Cart
            </Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setEditing((v) => !v)}
            >
              <Text
                className={`text-sm font-semibold uppercase underline ${
                  editing ? "text-[#32B768]" : "text-primary"
                }`}
              >
                {editing ? "Done" : "Edit items"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <Feather name="shopping-bag" size={40} color="white" />
            </View>
            <Text className="mt-6 text-xl font-semibold text-white">
              Your cart is empty
            </Text>
            <Text className="mt-2 text-center text-base text-white/60">
              Add something tasty to get started.
            </Text>
            <PrimaryButton
              title="Browse food"
              className="mt-8 w-full"
              onPress={() => router.back()}
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4 }}
          >
            {items.map((item) => (
              <CartRow
                key={`${item.foodId}-${item.size}`}
                item={item}
                editing={editing}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>

      {items.length > 0 && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          className="rounded-t-[24px] bg-white px-6 pt-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] uppercase tracking-wide text-muted">
              Delivery address
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push("/(profile)/addresses")}
            >
              <Text className="text-sm font-semibold uppercase text-primary underline">
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-3 min-h-[62px] justify-center rounded-[10px] bg-field px-5 py-3">
            <Text className="text-sm text-textLight">
              {addressText || "Add a delivery address"}
            </Text>
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <View className="flex-row items-baseline gap-3">
              <Text className="text-sm uppercase tracking-wide text-muted">
                Total:
              </Text>
              <Text
                accessibilityLabel={`Total ${formatPrice(total)}`}
                className="text-[30px] text-secondary"
              >
                {formatPrice(total)}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={8}
              onPress={showBreakdown}
              className="flex-row items-center"
            >
              <Text className="text-sm text-primary">Breakdown</Text>
              <Feather name="chevron-right" size={16} color="#181C2E" />
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title="Place order"
            className="mt-5"
            disabled={editing}
            onPress={() => router.push("/(main)/payment")}
          />
        </View>
      )}
    </View>
  );
}
