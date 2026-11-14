import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { Address, AddressLabel, useUser } from "@/context/UserContext";
import Feather from "@expo/vector-icons/Feather";
import { showAlert } from "@/utils/alerts";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LABEL_ICONS: Record<
  AddressLabel,
  { icon: keyof typeof Feather.glyphMap; color: string }
> = {
  Home: { icon: "home", color: "#369BFF" },
  Work: { icon: "briefcase", color: "#A03BB1" },
  Other: { icon: "map-pin", color: "#FB6F3D" },
};

const formatAddress = (a: Address) =>
  [
    a.address,
    a.apartment && `Apt ${a.apartment}`,
    a.street,
    a.postCode,
  ]
    .filter(Boolean)
    .join(", ");

export default function Addresses() {
  const { addresses, deleteAddress } = useUser();

  const confirmDelete = (a: Address) =>
    showAlert("Delete address", `Remove your ${a.label} address?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAddress(a.id),
      },
    ]);

  return (
    <Screen
      title="My Addresses"
      footer={
        <PrimaryButton
          title="ADD NEW ADDRESS"
          onPress={() => router.push("/(profile)/edit-addresses")}
        />
      }
    >
      {addresses.length === 0 ? (
        <View className="items-center px-6 pt-20">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-surface">
            <Feather name="map-pin" size={32} color="#A0A5BA" />
          </View>
          <Text className="mt-5 text-lg font-semibold text-secondary">
            No addresses yet
          </Text>
          <Text className="mt-1 text-center text-base text-textLight">
            Add a delivery address to get your food faster.
          </Text>
        </View>
      ) : (
        addresses.map((a) => {
          const { icon, color } = LABEL_ICONS[a.label];
          return (
            <View
              key={a.id}
              className="mb-4 flex-row items-center gap-4 rounded-2xl bg-surface p-5"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <Feather name={icon} size={20} color={color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold uppercase text-secondary">
                  {a.label}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-textLight">
                  {formatAddress(a)}
                </Text>
              </View>
              <View className="flex-row items-center gap-5">
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${a.label} address`}
                  hitSlop={10}
                  onPress={() =>
                    router.push({
                      pathname: "/(profile)/edit-addresses",
                      params: { id: a.id },
                    })
                  }
                >
                  <Feather name="edit" size={20} color="#FB6F3D" />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${a.label} address`}
                  hitSlop={10}
                  onPress={() => confirmDelete(a)}
                >
                  <Feather name="trash-2" size={20} color="#E5484D" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
}
