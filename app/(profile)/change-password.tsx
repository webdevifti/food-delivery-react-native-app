import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { showAlert } from "@/utils/alerts";
import { hasErrors, passwordError } from "@/utils/validation";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native";

export default function ChangePassword() {
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    current: current ? undefined : "Enter your current password",
    password:
      passwordError(password) ??
      (password === current ? "Choose a different password" : undefined),
    confirm: confirm !== password ? "Passwords do not match" : undefined,
  };
  const show = (key: keyof typeof errors) =>
    submitted ? errors[key] : undefined;

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    // TODO: send to the backend, which must verify the current password.
    showAlert("Password updated", "Your password has been changed.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <Screen
      title="Change Password"
      footer={<PrimaryButton title="Save" onPress={handleSave} />}
    >
      <FormField
        label="Current password"
        password
        placeholder="* * * * * * * * * *"
        value={current}
        onChangeText={setCurrent}
        error={show("current")}
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={() => newRef.current?.focus()}
      />
      <FormField
        ref={newRef}
        label="New password"
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
        label="Re-type new password"
        password
        placeholder="* * * * * * * * * *"
        value={confirm}
        onChangeText={setConfirm}
        error={show("confirm")}
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
    </Screen>
  );
}
