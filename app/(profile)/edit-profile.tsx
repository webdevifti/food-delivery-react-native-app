import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const profileImg = require("../../assets/images/profile.png");

const EditProfile = () => {
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
          <Text className="text-[20px] font-semibold">Edit Profile</Text>
        </View>
      </View>
      <View className="relative flex flex-row items-center gap-8 mx-auto mb-8">
        <Image source={profileImg} className="rounded-full" />
        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
          <Feather name="edit-2" size={18} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">
            Full Name
          </Text>
          <TextInput
            placeholder="Enter Name"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6"
          />
        </View>
        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">Email</Text>
          <TextInput
            placeholder="Enter Email"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6"
          />
        </View>
        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">
            Contact Number
          </Text>
          <TextInput
            placeholder="Enter Contact Number"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6"
          />
        </View>
        <View className="mb-4">
          <Text className="uppercase font-normal text-[14px] mb-2">Bio</Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder="Bio"
            textAlignVertical="top"
            className="bg-[#F0F5FA] rounded-xl py-5 px-6 h-40"
          />
        </View>
        <TouchableOpacity className="bg-primary rounded-xl w-full py-5">
          <Text className="text-center text-white font-semibold text-[18px]">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
