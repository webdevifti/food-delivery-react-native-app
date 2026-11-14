import MenuRow from "@/components/ui/MenuRow";
import Screen from "@/components/ui/Screen";
import { Settings, useAccount } from "@/context/AccountContext";
import { showAlert } from "@/utils/alerts";
import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Switch, Text, View } from "react-native";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-[13px] uppercase tracking-wide text-muted">
        {title}
      </Text>
      <View className="gap-4 rounded-2xl bg-surface p-5">{children}</View>
    </View>
  );
}

function ToggleRow({
  label,
  hint,
  settingKey,
}: {
  label: string;
  hint: string;
  settingKey: keyof Settings;
}) {
  const { settings, setSetting } = useAccount();
  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-1">
        <Text className="text-base text-secondary">{label}</Text>
        <Text className="mt-0.5 text-xs text-textLight">{hint}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        value={settings[settingKey]}
        onValueChange={(v) => setSetting(settingKey, v)}
        trackColor={{ false: "#E1E4EA", true: "#FFB68A" }}
        thumbColor={settings[settingKey] ? "#FF7622" : "#FFFFFF"}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const confirmDelete = () =>
    showAlert(
      "Delete account",
      "This will remove your account and sign you out. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => router.replace("/(auth)/login"),
        },
      ],
    );

  return (
    <Screen title="Settings">
      <Group title="Notifications">
        <ToggleRow
          label="Push notifications"
          hint="Alerts on your phone"
          settingKey="push"
        />
        <ToggleRow
          label="Order updates"
          hint="Status changes for your orders"
          settingKey="orderUpdates"
        />
        <ToggleRow
          label="Offers & promotions"
          hint="Coupons and special deals"
          settingKey="promotions"
        />
      </Group>

      <Group title="Account">
        <MenuRow
          label="Edit profile"
          icon={<Feather name="user" size={16} color="#FB6F3D" />}
          onPress={() => router.push("/(profile)/edit-profile")}
        />
        <MenuRow
          label="Change password"
          icon={<Feather name="lock" size={16} color="#413DFB" />}
          onPress={() => router.push("/(profile)/change-password")}
        />
        <MenuRow
          label="Delete account"
          icon={<Feather name="trash-2" size={16} color="#FB4A59" />}
          onPress={confirmDelete}
        />
      </Group>

      <Group title="About">
        <MenuRow
          label="Terms & Conditions"
          icon={<Feather name="file-text" size={16} color="#369BFF" />}
          onPress={() =>
            router.push({ pathname: "/(profile)/legal", params: { doc: "terms" } })
          }
        />
        <MenuRow
          label="Privacy Policy"
          icon={<Feather name="shield" size={16} color="#2AE1E1" />}
          onPress={() =>
            router.push({ pathname: "/(profile)/legal", params: { doc: "privacy" } })
          }
        />
        <View className="min-h-[44px] flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Feather name="info" size={16} color="#FFAA2A" />
            </View>
            <Text className="text-base text-secondary">App version</Text>
          </View>
          <Text className="text-sm text-textLight">{version}</Text>
        </View>
      </Group>
    </Screen>
  );
}
