import AuthLayout from "@/components/ui/AuthLayout";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { emailError, hasErrors } from "@/utils/validation";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const SOCIALS = [
  { name: "facebook-f", label: "Facebook", bg: "#395998" },
  { name: "twitter", label: "Twitter", bg: "#169CE8" },
  { name: "apple", label: "Apple", bg: "#1B1F2F" },
] as const;

export default function Login() {
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    email: emailError(email),
    password: password ? undefined : "Password is required",
  };

  const handleLogin = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    router.replace("/(main)/home");
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="Please sign in to your existing account"
      showBack={false}
    >
      <FormField
        label="Email"
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        error={submitted ? errors.email : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <FormField
        ref={passwordRef}
        label="Password"
        password
        placeholder="* * * * * * * * * *"
        value={password}
        onChangeText={setPassword}
        error={submitted ? errors.password : undefined}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        containerClassName="mb-5"
      />

      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: remember }}
          activeOpacity={0.8}
          hitSlop={8}
          onPress={() => setRemember((v) => !v)}
          className="flex-row items-center gap-2"
        >
          <View
            className={`h-5 w-5 items-center justify-center rounded border ${
              remember ? "border-primary bg-primary" : "border-[#CBD3E0]"
            }`}
          >
            {remember && <AntDesign name="check" size={14} color="white" />}
          </View>
          <Text className="text-sm text-textLight">Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text className="text-sm text-primary">Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton title="Log In" onPress={handleLogin} />

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-base text-textLight">
          Don&apos;t have an account?{" "}
        </Text>
        <TouchableOpacity
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text className="text-sm font-bold uppercase text-primary">
            Sign up
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-6 text-center text-base text-textLight">Or</Text>
      <View className="mt-4 flex-row items-center justify-center gap-[30px]">
        {SOCIALS.map((s) => (
          <TouchableOpacity
            key={s.name}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${s.label}`}
            activeOpacity={0.8}
            style={{ backgroundColor: s.bg }}
            className="h-[62px] w-[62px] items-center justify-center rounded-full"
          >
            <FontAwesome5 name={s.name} size={24} color="white" />
          </TouchableOpacity>
        ))}
      </View>
    </AuthLayout>
  );
}
