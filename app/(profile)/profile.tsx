import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const profileImg = require("../../assets/images/profile.png");

const profile = () => {
  return (
    <SafeAreaView className="px-8 bg-white mb-24">
      <View className="flex flex-row items-center justify-between pt-5 mb-8">
        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#F6F8FA] rounded-full w-[45px] h-[45px] flex flex-row items-center justify-center"
          >
            <Entypo name="chevron-small-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-[20px] font-semibold">Profile</Text>
        </View>
        <View className="bg-[#F6F8FA] rounded-full w-[45px] h-[45px] flex flex-row items-center justify-center">
          <Feather name="more-horizontal" size={24} color="black" />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View></View>
        <View>
          <View className="flex flex-row items-center gap-8 mx-auto mb-8">
            <Image source={profileImg} className="rounded-full" />
            <View>
              <Text className="text-[20px] font-bold mb-2">Eftekhar Alam</Text>
              <Text className="text-[14px] text-[#A0A5BA]">
                I am food lover.
              </Text>
            </View>
          </View>

          <View>
            <View className="bg-[#F6F8FA] rounded-2xl p-5 mb-5">
              <TouchableOpacity
                onPress={() => router.push("/(profile)/personal-info")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Feather name="user" size={14} color="#FB6F3D" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Personal Info
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Entypo name="map" size={14} color="#413DFB" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Addresses
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
            </View>

            <View className="bg-[#F6F8FA] rounded-2xl p-5 mb-5">
              <TouchableOpacity
                onPress={() => router.push("/(profile)/personal-info")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <SimpleLineIcons name="bag" size={14} color="#369BFF" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Cart
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Feather name="heart" size={14} color="#B33DFB" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Favourite
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Feather name="bell" size={14} color="#FFAA2A" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Notifications
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Feather name="credit-card" size={14} color="#369BFF" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Payment Methods
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
            </View>

            <View className="bg-[#F6F8FA] rounded-2xl p-5 mb-5">
              <TouchableOpacity
                onPress={() => router.push("/(profile)/personal-info")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <AntDesign
                      name="question-circle"
                      size={14}
                      color="#FB6D3A"
                    />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    FAQs
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <MaterialIcons name="reviews" size={14} color="#2AE1E1" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    User Reviews
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(profile)/addresses")}
                className="flex flex-row items-center justify-between mb-4"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <Feather name="settings" size={14} color="#413DFB" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Settings
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#F6F8FA] rounded-2xl p-5">
              <TouchableOpacity
                onPress={() => router.push("/(profile)/personal-info")}
                className="flex flex-row items-center justify-between"
              >
                <View className="flex flex-row items-center gap-8">
                  <View className="bg-white rounded-full p-2 items-center justify-center flex h-[40px] w-[40px]">
                    <MaterialIcons name="logout" size={14} color="#FB4A59" />
                  </View>
                  <Text className="text-base font-normal text-secondary">
                    Logout
                  </Text>
                </View>
                <Entypo name="chevron-small-right" size={24} color="#747783" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
