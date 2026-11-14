import AuthLayout from "@/components/ui/AuthLayout";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { emailError } from "@/utils/validation";
import { router } from "expo-router";
import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const error = emailError(email);

  const handleSend = () => {
    setSubmitted(true);
    if (error) return;
    router.push({
      pathname: "/(auth)/verify",
      params: { email: email.trim(), flow: "reset" },
    });
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Please sign in to your existing account"
    >
      <FormField
        label="Email"
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        error={submitted ? error : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="go"
        onSubmitEditing={handleSend}
      />
      <PrimaryButton title="Send Code" onPress={handleSend} />
    </AuthLayout>
  );
}
