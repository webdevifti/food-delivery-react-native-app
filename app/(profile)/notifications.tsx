import { NotificationType } from "@/assets/data/account";
import Screen from "@/components/ui/Screen";
import { useAccount } from "@/context/AccountContext";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const STYLE: Record<
  NotificationType,
  { icon: keyof typeof Feather.glyphMap; color: string; bg: string }
> = {
  order: { icon: "package", color: "#FF7622", bg: "#FFEBE4" },
  delivery: { icon: "truck", color: "#369BFF", bg: "#E5F1FF" },
  offer: { icon: "tag", color: "#B33DFB", bg: "#F3E8FF" },
  system: { icon: "info", color: "#FFAA2A", bg: "#FFF4DD" },
};

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useAccount();

  return (
    <Screen
      title="Notifications"
      right={
        unreadCount > 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            hitSlop={10}
            onPress={markAllRead}
          >
            <Text className="text-sm font-semibold text-primary">
              Mark all read
            </Text>
          </TouchableOpacity>
        ) : undefined
      }
    >
      {notifications.length === 0 ? (
        <View className="items-center px-6 pt-20">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
            <Feather name="bell-off" size={38} color="#A0A5BA" />
          </View>
          <Text className="mt-6 text-lg font-semibold text-secondary">
            You&apos;re all caught up
          </Text>
          <Text className="mt-1 text-center text-base text-textLight">
            New updates about your orders and offers will appear here.
          </Text>
        </View>
      ) : (
        notifications.map((n) => {
          const s = STYLE[n.type];
          return (
            <TouchableOpacity
              key={n.id}
              accessibilityRole="button"
              accessibilityLabel={`${n.title}. ${n.read ? "" : "Unread."}`}
              activeOpacity={0.8}
              onPress={() => {
                markRead(n.id);
                if (n.type === "order" || n.type === "delivery")
                  router.push("/(main)/orders");
              }}
              className={`mb-3 flex-row gap-4 rounded-2xl p-4 ${
                n.read ? "bg-surface" : "bg-[#FFF6F0]"
              }`}
            >
              <View
                style={{ backgroundColor: s.bg }}
                className="h-12 w-12 items-center justify-center rounded-full"
              >
                <Feather name={s.icon} size={20} color={s.color} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between gap-2">
                  <Text
                    numberOfLines={1}
                    className={`flex-1 text-base text-secondary ${n.read ? "font-semibold" : "font-bold"}`}
                  >
                    {n.title}
                  </Text>
                  {!n.read && (
                    <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </View>
                <Text className="mt-1 text-sm leading-5 text-textLight">
                  {n.body}
                </Text>
                <Text className="mt-2 text-xs text-muted">{n.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </Screen>
  );
}
