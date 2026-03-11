import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const verify = () => {
  return (
    <SafeAreaView className="bg-black h-full">
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")}
        resizeMethod="cover"
        className="flex-1 w-full h-full"
      >
        <View className="flex flex-col items-center justify-center mt-20">
          <Text className="text-white text-[30px] font-bold">Verification</Text>
          <Text className="text-gray-300 font-normal text-base">
            Please sign in to your existing account
          </Text>
        </View>
      </ImageBackground>
      <View className="bg-white px-6 py-8 rounded-t-[30px]">
        <View className="mb-5">
          <Text className="mb-1 text-[14px] text-secondary">OTP</Text>

          <View className="flex flex-row items-center gap-8">
            <TextInput
              placeholder=""
              className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] text-[24px] rounded-lg px-8 py-5"
            />
            <TextInput
              placeholder=""
              className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] text-[24px] rounded-lg px-8 py-5"
            />
            <TextInput
              placeholder=""
              className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] text-[24px] rounded-lg px-8 py-5"
            />
            <TextInput
              placeholder=""
              className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] text-[24px] rounded-lg px-8 py-5"
            />
            <TextInput
              placeholder=""
              className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] text-[24px] rounded-lg px-8 py-5"
            />
          </View>
        </View>

        <TouchableOpacity className="bg-primary rounded-lg py-5 mt-2">
          <Text className="text-white font-semibold text-xl text-center">
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default verify;

const styles = StyleSheet.create({});
