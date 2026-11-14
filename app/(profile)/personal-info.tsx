import Avatar from "@/components/ui/Avatar";
import Screen from "@/components/ui/Screen";
import { useUser } from "@/context/UserContext";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xs font-semibold uppercase text-textLight">
          {label}
        </Text>
        <Text className="mt-0.5 text-base font-semibold text-secondary">
          {value || "—"}
        </Text>
      </View>
    </View>
  );
}

export default function PersonalInfo() {
  const { profile } = useUser();

  return (
    <Screen
      title="Personal Info"
      right={
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          hitSlop={12}
          onPress={() => router.push("/(profile)/edit-profile")}
        >
          <Text className="text-lg font-semibold text-primary">Edit</Text>
        </TouchableOpacity>
      }
    >
      <View className="mb-8 mt-2 items-center">
        <Avatar uri={profile.photo} size={96} />
        <Text className="mt-4 text-xl font-bold text-secondary">
          {profile.name}
        </Text>
        {!!profile.bio && (
          <Text className="mt-1 text-sm text-muted">{profile.bio}</Text>
        )}
      </View>

      <View className="gap-5 rounded-2xl bg-surface p-5">
        <InfoRow
          icon={<Feather name="user" size={16} color="#FB6F3D" />}
          label="Full name"
          value={profile.name}
        />
        <InfoRow
          icon={<FontAwesome5 name="envelope" size={16} color="#413DFB" />}
          label="Email"
          value={profile.email}
        />
        <InfoRow
          icon={<Feather name="phone" size={16} color="#369BFF" />}
          label="Contact number"
          value={profile.phone}
        />
      </View>
    </Screen>
  );
}
