import AuthLayout from "@/components/ui/AuthLayout";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { hasErrors, passwordError } from "@/utils/validation";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native";

export default function ResetPassword() {
  const confirmRef = useRef<TextInput>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    password: passwordError(password),
    confirm: confirm !== password ? "Passwords do not match" : undefined,
  };

  const handleReset = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    // TODO: send the new password to the backend.
    router.replace("/(auth)/login");
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
    >
      <FormField
        label="New Password"
        password
        placeholder="* * * * * * * * * *"
        value={password}
        onChangeText={setPassword}
        error={submitted ? errors.password : undefined}
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
        error={submitted ? errors.confirm : undefined}
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleReset}
      />
      <PrimaryButton title="Reset Password" onPress={handleReset} />
    </AuthLayout>
  );
}
