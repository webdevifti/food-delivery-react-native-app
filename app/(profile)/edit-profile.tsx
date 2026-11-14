import FormField from "@/components/ui/FormField";
import ActionSheet from "@/components/ui/ActionSheet";
import Avatar from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { useUser } from "@/context/UserContext";
import { showAlert } from "@/utils/alerts";
import { emailError, hasErrors } from "@/utils/validation";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

const PICKER_OPTIONS = {
  allowsEditing: true,
  aspect: [1, 1] as [number, number],
  quality: 0.7,
};

export default function EditProfile() {
  const { profile, updateProfile } = useUser();
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [photo, setPhoto] = useState(profile.photo);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: name.trim() ? undefined : "Name is required",
    email: emailError(email),
    phone:
      phone.trim() && !/^\+?[\d\s-]{7,15}$/.test(phone.trim())
        ? "Enter a valid phone number"
        : undefined,
  };
  const show = (key: keyof typeof errors) =>
    submitted ? errors[key] : undefined;

  const takePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        showAlert(
          "Camera access needed",
          "Allow camera access in your device settings to take a photo.",
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch {
      showAlert("Couldn't open the camera", "Please try again.");
    }
  };

  const choosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        ...PICKER_OPTIONS,
        mediaTypes: ["images"],
      });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch {
      showAlert("Couldn't open your photos", "Please try again.");
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      photo,
    });
    router.back();
  };

  return (
    <Screen
      title="Edit Profile"
      footer={<PrimaryButton title="Save" onPress={handleSave} />}
    >
      <View className="mb-8 mt-2 items-center">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          activeOpacity={0.9}
          onPress={() => setSheetOpen(true)}
        >
          <Avatar uri={photo} size={110} />
          <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary">
            <Feather name="camera" size={18} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setSheetOpen(true)}
          className="mt-3"
        >
          <Text className="text-sm font-semibold text-primary">Change photo</Text>
        </TouchableOpacity>
      </View>

      <FormField
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        error={show("name")}
        autoCapitalize="words"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <FormField
        ref={emailRef}
        label="Email"
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        error={show("email")}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />
      <FormField
        ref={phoneRef}
        label="Contact Number"
        placeholder="+8801912345678"
        value={phone}
        onChangeText={setPhone}
        error={show("phone")}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => bioRef.current?.focus()}
      />
      <FormField
        ref={bioRef}
        label="Bio"
        placeholder="Tell us about yourself"
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={120}
        containerClassName="mb-2"
      />

      <ActionSheet
        visible={sheetOpen}
        title="Profile photo"
        onClose={() => setSheetOpen(false)}
        options={[
          // The camera isn't available in desktop browsers.
          ...(Platform.OS === "web"
            ? []
            : [
                {
                  label: "Take a photo",
                  icon: <Feather name="camera" size={18} color="#181C2E" />,
                  onPress: takePhoto,
                },
              ]),
          {
            label: "Choose from library",
            icon: <Feather name="image" size={18} color="#181C2E" />,
            onPress: choosePhoto,
          },
          ...(photo
            ? [
                {
                  label: "Remove photo",
                  destructive: true,
                  icon: <Feather name="trash-2" size={18} color="#E5484D" />,
                  onPress: () => setPhoto(undefined),
                },
              ]
            : []),
        ]}
      />
    </Screen>
  );
}
