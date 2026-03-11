import AntDesign from "@expo/vector-icons/AntDesign";
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

const signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="bg-black h-full">
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")}
        resizeMethod="cover"
        className="flex-1 w-full h-full"
      >
        <View className="flex flex-col items-center justify-center mt-20">
          <Text className="text-white text-[30px] font-bold">Sign up</Text>
          <Text className="text-gray-300 font-normal text-base">
            Please sign in to your existing account
          </Text>
        </View>
      </ImageBackground>
      <View className="bg-white px-6 py-8 rounded-t-[30px]">
        <View className="mb-5">
          <Text className="mb-1 text-[14px] text-secondary">Name</Text>
          <TextInput
            placeholder="Enter name"
            className="bg-[#F0F5FA] text-[#A0A5BA] placeholder:text-[#A0A5BA] rounded-lg px-5 py-5"
          />
        </View>
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
        <View className="relative mb-5">
          <Text className="mb-1 text-[14px] text-secondary">
            Re-Type-Password
          </Text>
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

        <TouchableOpacity className="bg-primary rounded-lg py-5 mt-2">
          <Text className="text-white font-semibold text-xl text-center">
            Signup
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default signup;

const styles = StyleSheet.create({});
