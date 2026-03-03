import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <SafeAreaView className="bg-black h-full">
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")}
        resizeMethod="cover"
        className="flex-1 w-full h-full"
      >
        <View className="flex flex-col items-center justify-center mt-40">
          <Text className="text-white text-[30px] font-bold">Log In</Text>
          <Text className="text-gray-300 font-normal text-base">
            Please sign in to your existing account
          </Text>
        </View>
      </ImageBackground>
      <View className="bg-white px-6 py-8 rounded-t-[30px]">
        <View className="mb-5">
          <Text className="mb-1 text-[14px] text-secondary">Email</Text>
          <TextInput
            placeholder="example@gmail.com"
            className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] rounded-lg px-5 py-5"
          />
        </View>
        <View className="relative mb-5">
          <Text className="mb-1 text-[14px] text-secondary">Password</Text>
          <TextInput
            textContentType="password"
            secureTextEntry={!showPassword}
            placeholder="........"
            className=" bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] rounded-lg px-5 py-5"
          />
          <TouchableOpacity
            className="absolute right-4 top-11"
            onPress={() => setShowPassword(!showPassword)}
          >
            <AntDesign
              name={showPassword ? "eye" : "eye-invisible"}
              size={24}
              color="#A0A5BA"
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-between mb-5">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => setChecked(!checked)}
            activeOpacity={0.8}
          >
            <View
              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                checked ? "bg-primary border-primary" : "border-light"
              }`}
            >
              {checked && <AntDesign name="check" size={16} color="white" />}
            </View>
            <Text className="text-gray-700 text-base">Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-primary">Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="bg-primary rounded-lg py-5 mt-2">
          <Text className="text-white font-semibold text-xl text-center">
            Login
          </Text>
        </TouchableOpacity>
        <View className="mt-8 flex flex-row items-center gap-1 justify-center">
          <Text className="text-base font-normal text-gray-500">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-primary uppercase font-semibold text-base">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
