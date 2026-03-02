import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const profileImg = require("../../assets/images/profile.png");
const PersonalInfo = () => {
  return (
    <SafeAreaView className="px-8 bg-white h-full">
      <View></View>
      <View>
        <View className="flex flex-row items-center gap-8 mx-auto mb-8">
          <Image source={profileImg} className="rounded-full" />
          <View>
            <Text className="text-[20px] font-bold mb-2">Eftekhar Alam</Text>
            <Text className="text-[14px] text-[#A0A5BA]">I am food lover.</Text>
          </View>
        </View>

        <View>
          <View className="bg-[#F6F8FA] rounded-2xl p-5 ">
            <View className="flex flex-row items-center gap-6 mb-4">
              <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                <Feather name="user" size={14} color="#FB6F3D" />
              </View>
              <View>
                <Text className="text-base font-semibold  text-secondary uppercase">
                  Full name
                </Text>
                <Text className="text-[12px] font-semibold text-[#6B6E82]">
                  Eftekhar Alam
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-6 mb-4">
              <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                <FontAwesome5 name="envelope" size={14} color="#413DFB" />
              </View>
              <View>
                <Text className="text-base font-semibold  text-secondary uppercase">
                  Email
                </Text>
                <Text className="text-[12px] font-semibold text-[#6B6E82]">
                  example@mail.com
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-6">
              <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                <Feather name="phone" size={14} color="#369BFF" />
              </View>
              <View>
                <Text className="text-base font-semibold  text-secondary uppercase">
                  Contact Number
                </Text>
                <Text className="text-[12px] font-semibold text-[#6B6E82]">
                  +8801912345678
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalInfo;

const styles = StyleSheet.create({});
