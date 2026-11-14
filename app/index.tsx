import { sliders } from "@/assets/data/OnboardSlider";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<(typeof sliders)[number]>>(null);
  const [index, setIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const isLast = index === sliders.length - 1;

  const goToLogin = () => router.replace("/(auth)/login");

  const handleNext = () => {
    if (isLast) {
      goToLogin();
      return;
    }
    const next = index + 1;
    setIndex(next);
    listRef.current?.scrollToOffset({ offset: next * width, animated: true });
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View
        className="mt-4 flex-1"
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
      >
        {listHeight > 0 && (
          <FlatList
            ref={listRef}
            data={sliders}
            keyExtractor={(item) => String(item.id)}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            renderItem={({ item }) => (
              <View style={{ width, height: listHeight }} className="px-6">
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={{ flex: 1, width: "100%" }}
                />
                <Text
                  accessibilityRole="header"
                  className="mt-10 text-center text-2xl font-bold text-secondary"
                >
                  {item.title}
                </Text>
                <Text className="mt-4 text-center text-base leading-6 text-textLight">
                  {item.description}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Page ${index + 1} of ${sliders.length}`}
        className="mt-6 flex-row items-center justify-center gap-3"
      >
        {sliders.map((s, i) => (
          <View
            key={s.id}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-primary" : "bg-[#FFE1CE]"
            }`}
          />
        ))}
      </View>

      <View className="mt-12 px-6">
        <PrimaryButton
          title={isLast ? "Get Started" : "Next"}
          onPress={handleNext}
        />
        {/* Always rendered so the layout doesn't shift on the last slide. */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          disabled={isLast}
          hitSlop={8}
          onPress={goToLogin}
          className={`items-center py-5 ${isLast ? "opacity-0" : ""}`}
        >
          <Text className="text-base text-textLight">Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
