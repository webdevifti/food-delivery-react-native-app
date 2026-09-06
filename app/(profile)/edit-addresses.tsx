import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const profileImg = require("../../assets/images/profile.png");

const EditProfile = () => {
  const [addressLabel, setAddressLabel] = useState("Home");

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
          <Text className="text-[20px] font-semibold">Add New Address</Text>
        </View>
      </View>

      <View>
        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">
            Address Name
          </Text>
          <TextInput
            placeholder="3235, 5th Avenue, New York"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6"
          />
        </View>
        {/* need 2 columns */}
        <View className="flex flex-row gap-4">
          <View className="mb-4 min-w-0 flex-1">
            <Text className="uppercase font-normal text-[14px] mb-2">
              Street
            </Text>
            <TextInput
              placeholder="Hason Nagar"
              className="bg-[#F0F5FA] rounded-xl py-5 px-6"
            />
          </View>
          <View className="mb-4 min-w-0 flex-1">
            <Text className="uppercase font-normal text-[14px] mb-2">
              Post Code
            </Text>
            <TextInput
              placeholder="10001"
              className="bg-[#F0F5FA] rounded-xl py-5 px-6"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">
            Apartment
          </Text>
          <TextInput
            placeholder="32"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6"
          />
        </View>
        <View className="mb-4">
          {/* Radio input - Home,Office,Other */}
          <Text className="uppercase font-normal text-[14px] mb-2">
            Label As
          </Text>
          <View className="flex flex-row gap-4">
            {["Home", "Office", "Other"].map((label) => {
              const isActive = addressLabel === label;

              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setAddressLabel(label)}
                  className={`${isActive ? "bg-primary" : "bg-[#F0F5FA]"} rounded-3xl py-5 px-6 flex-1 items-center`}
                >
                  <Text className={isActive ? "text-white" : "text-black"}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <TouchableOpacity className="bg-primary rounded-xl w-full mt-4 py-5">
          <Text className="text-center text-white font-semibold text-[18px]">
            Save Location
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
