import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Addresses = () => {
  const editAddress = () => {};
  const deleteAddress = () => {};
  return (
    <SafeAreaView className="bg-white h-full px-5">
      <View className="flex flex-row items-center justify-between pt-5 mb-8">
        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#F6F8FA] rounded-full w-[45px] h-[45px] flex flex-row items-center justify-center"
          >
            <Entypo name="chevron-small-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-[20px] font-semibold">My Address</Text>
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          className="pt-5"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-[#F6F8FA] rounded-2xl p-5 mb-6">
            <View className="flex flex-row items-center gap-6">
              <View className="bg-white rounded-full p-2 items-center justify-center flex h-[45px] w-[45px]">
                <Feather name="home" size={20} color="#369BFF" />
              </View>
              <View>
                <View className="flex flex-row items-center justify-between mb-2">
                  <Text className="text-base font-semibold  text-secondary uppercase mb-2">
                    Home
                  </Text>
                  <View className="flex flex-row items-center gap-6">
                    <TouchableOpacity onPress={editAddress}>
                      <Feather name="edit" size={20} color="#FB6F3D" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteAddress}>
                      <Feather name="trash" size={20} color="#FB6F3D" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-[14px] font-normal text-[#6B6E82]">
                  2464 Royal Ln, Meso, New Jarsey 45463
                </Text>
              </View>
            </View>
          </View>
          <View className="bg-[#F6F8FA] rounded-2xl p-5 mb-6">
            <View className="flex flex-row items-center gap-6 mb-4">
              <View className="bg-white rounded-full p-2 items-center justify-center flex h-[45px] w-[45px]">
                <Feather name="briefcase" size={20} color="#A03BB1" />
              </View>
              <View>
                <View className="flex flex-row items-center justify-between mb-2">
                  <Text className="text-base font-semibold  text-secondary uppercase mb-2">
                    Work
                  </Text>
                  <View className="flex flex-row items-center gap-6">
                    <TouchableOpacity onPress={editAddress}>
                      <Feather name="edit" size={20} color="#FB6F3D" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteAddress}>
                      <Feather name="trash" size={20} color="#FB6F3D" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-[14px] font-normal text-[#6B6E82]">
                  2464 Royal Ln, Meso, New Jarsey 45463
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="mb-5 w-full">
          <TouchableOpacity onPress={() => router.push('/(profile)/edit-addresses')} className="bg-primary w-full rounded-xl py-5 px-3">
            <Text className="uppercase font-semibold text-white  text-center">
              Add new address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Addresses;

const styles = StyleSheet.create({});
