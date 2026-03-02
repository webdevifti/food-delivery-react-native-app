import { sliders } from "@/assets/data/OnboardSlider";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Slider() {
  const sliderRef = useRef<any>(null);
  const [index, setIndex] = useState(0);
  const handleNext = () => {
    if (index === sliders.length - 1) {
      router.push("/(auth)/login");
    } else {
      sliderRef.current?.scrollBy(1);
    }
  };
  return (
    <SafeAreaView>
      <View className="bg-orange-50 h-full px-6 py-6">
        <Swiper
          onIndexChanged={(i) => setIndex(i)}
          ref={sliderRef}
          showsButtons={false}
          showsPagination={true}
          dotStyle={{ backgroundColor: "#FFE1CE", width: 8, height: 8 }}
          activeDotStyle={{
            backgroundColor: "#FF7622",
            width: 10,
            height: 10,
            borderRadius: 10,
          }}
        >
          {sliders.map((slider) => (
            <View className="mt-10" key={slider.id}>
              <Image source={slider.image} className="mx-auto" />
              <Text className="text-secondary text-3xl text-center mt-10 font-bold">
                {slider.title}
              </Text>
              <Text className="text-base text-textLight  text-center mt-5 font-normal">
                {slider.description}
              </Text>
            </View>
          ))}
        </Swiper>
        <View>
          <TouchableOpacity
            className="bg-primary rounded-lg py-5"
            onPress={handleNext}
          >
            <Text className="text-white font-semibold text-xl text-center">
              {index === sliders.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-5 mt-2"
            onPress={() => router.push("/(profile)/profile")}
          >
            <Text className="text-secondary font-semibold text-xl text-center">
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
