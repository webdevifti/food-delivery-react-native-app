import AuthLayout from "@/components/ui/AuthLayout";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useUser } from "@/context/UserContext";
import { emailError, hasErrors, passwordError } from "@/utils/validation";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signup() {
  const { updateProfile } = useUser();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: name.trim() ? undefined : "Name is required",
    email: emailError(email),
    password: passwordError(password),
    confirm:
      confirm !== password ? "Passwords do not match" : undefined,
  };
  const show = (key: keyof typeof errors) =>
    submitted ? errors[key] : undefined;

  const handleSignup = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    router.push({
      pathname: "/(auth)/verify",
      params: { email: email.trim(), flow: "signup" },
    });
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Please sign up to get started">
      <FormField
        label="Name"
        placeholder="John doe"
        value={name}
        onChangeText={setName}
        error={show("name")}
        autoCapitalize="words"
        autoComplete="name"
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
        error={show("password")}
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <FormField
        ref={confirmRef}
        label="Re-type Password"
        password
        placeholder="* * * * * * * * * *"
        value={confirm}
        onChangeText={setConfirm}
        error={show("confirm")}
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSignup}
      />

      <PrimaryButton title="Sign Up" onPress={handleSignup} className="mt-2" />

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-base text-textLight">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity
          accessibilityRole="link"
          hitSlop={8}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(auth)/login")
          }
        >
          <Text className="text-sm font-bold uppercase text-primary">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
