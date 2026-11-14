import CircleButton from "@/components/food/CircleButton";
import MenuRow from "@/components/ui/MenuRow";
import Avatar from "@/components/ui/Avatar";
import Screen from "@/components/ui/Screen";
import { useAccount } from "@/context/AccountContext";
import { useUser } from "@/context/UserContext";
import { showAlert } from "@/utils/alerts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Href, router } from "expo-router";
import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type Item = {
  label: string;
  icon: ReactNode;
  route: Href;
  /** Shows a count bubble, e.g. unread notifications. */
  badgeKey?: "unread";
};

const SECTIONS: Item[][] = [
  [
    {
      label: "Personal Info",
      icon: <Feather name="user" size={16} color="#FB6F3D" />,
      route: "/(profile)/personal-info",
    },
    {
      label: "Addresses",
      icon: <Entypo name="map" size={16} color="#413DFB" />,
      route: "/(profile)/addresses",
    },
  ],
  [
    {
      label: "My Orders",
      icon: <Feather name="clipboard" size={16} color="#FB6F3D" />,
      route: "/(main)/orders",
    },
    {
      label: "Cart",
      icon: <SimpleLineIcons name="bag" size={16} color="#369BFF" />,
      route: "/(main)/cart",
    },
    {
      label: "Favourite",
      icon: <Feather name="heart" size={16} color="#B33DFB" />,
      route: "/(profile)/favourites",
    },
    {
      label: "Notifications",
      icon: <Feather name="bell" size={16} color="#FFAA2A" />,
      route: "/(profile)/notifications",
      badgeKey: "unread",
    },
    {
      label: "Payment Method",
      icon: <Feather name="credit-card" size={16} color="#369BFF" />,
      route: { pathname: "/(main)/payment", params: { manage: "1" } },
    },
  ],
  [
    {
      label: "FAQs",
      icon: <AntDesign name="question-circle" size={16} color="#FB6D3A" />,
      route: "/(profile)/faqs",
    },
    {
      label: "User Reviews",
      icon: <MaterialCommunityIcons name="apple-keyboard-command" size={16} color="#2AE1E1" />,
      route: "/(profile)/reviews",
    },
    {
      label: "Settings",
      icon: <Feather name="settings" size={16} color="#413DFB" />,
      route: "/(profile)/settings",
    },
  ],
];

export default function Profile() {
  const { profile } = useUser();
  const { unreadCount } = useAccount();

  const open = (item: Item) => router.push(item.route);

  const confirmLogout = () =>
    showAlert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => router.replace("/(auth)/login"),
      },
    ]);

  return (
    <Screen
      title="Profile"
      right={
        <CircleButton
          label="Edit profile"
          onPress={() => router.push("/(profile)/edit-profile")}
        >
          <Feather name="more-horizontal" size={22} color="#181C2E" />
        </CircleButton>
      }
    >
      <View className="mb-8 mt-2 flex-row items-center gap-6">
        <Avatar uri={profile.photo} size={100} />
        <View className="flex-1">
          <Text numberOfLines={1} className="text-xl font-bold text-secondary">
            {profile.name}
          </Text>
          {!!profile.bio && (
            <Text numberOfLines={2} className="mt-1 text-sm text-muted">
              {profile.bio}
            </Text>
          )}
        </View>
      </View>

      {SECTIONS.map((items, i) => (
        <View key={i} className="mb-5 gap-4 rounded-2xl bg-surface p-5">
          {items.map((item) => (
            <MenuRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              badge={item.badgeKey === "unread" ? unreadCount : undefined}
              onPress={() => open(item)}
            />
          ))}
        </View>
      ))}

      <View className="rounded-2xl bg-surface p-5">
        <MenuRow
          label="Log Out"
          icon={<MaterialIcons name="logout" size={16} color="#FB4A59" />}
          onPress={confirmLogout}
        />
      </View>
    </Screen>
  );
}
