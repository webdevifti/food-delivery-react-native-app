import MapIllustration from "@/components/ui/MapIllustration";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showAlert } from "@/utils/alerts";

export default function LocationAccess() {
  const [loading, setLoading] = useState(false);

  const goNext = () => router.replace("/(main)/home");

  const handleAccess = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        goNext();
        return;
      }
      showAlert(
        "Location is off",
        "You can turn it on later in Settings. You can also add your delivery address manually.",
        [{ text: "OK", onPress: goNext }],
      );
    } catch {
      showAlert("Something went wrong", "We couldn't ask for your location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center px-6">
        <MapIllustration size={300} />
        <PrimaryButton
          title="Access Location"
          onPress={handleAccess}
          loading={loading}
          rightIcon={<Feather name="map-pin" size={16} color="white" />}
          className="mt-12 w-full"
        />
        <Text className="mt-10 px-6 text-center text-base uppercase leading-6 text-textLight">
          Food will access your location only while using the app
        </Text>
      </View>
    </SafeAreaView>
  );
}
