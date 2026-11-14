import AuthLayout from "@/components/ui/AuthLayout";
import OtpInput from "@/components/ui/OtpInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 50;

export default function Verify() {
  const { email, flow } = useLocalSearchParams<{
    email?: string;
    flow?: string;
  }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleChange = (value: string) => {
    setCode(value);
    setError(false);
  };

  const handleVerify = () => {
    if (code.length < CODE_LENGTH) {
      setError(true);
      return;
    }
    // TODO: verify the code against the backend. Any full code passes for now.
    if (flow === "reset") router.replace("/(auth)/reset-password");
    else router.replace("/(auth)/location");
  };

  const handleResend = () => {
    setCode("");
    setError(false);
    setSeconds(RESEND_SECONDS);
    // TODO: request a new code from the backend.
  };

  return (
    <AuthLayout
      title="Verification"
      subtitle={
        <>
          We have sent a code to your email
          {email ? (
            <>
              {"\n"}
              <Text className="font-bold text-white">{email}</Text>
            </>
          ) : null}
        </>
      }
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[13px] uppercase tracking-wide text-secondary">
          Code
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            accessibilityState={{ disabled: seconds > 0 }}
            disabled={seconds > 0}
            hitSlop={8}
            onPress={handleResend}
          >
            <Text
              className={`text-sm font-bold underline ${
                seconds > 0 ? "text-secondary" : "text-primary"
              }`}
            >
              Resend
            </Text>
          </TouchableOpacity>
          {seconds > 0 && (
            <Text className="text-sm text-secondary"> in {seconds}sec</Text>
          )}
        </View>
      </View>
      <OtpInput
        value={code}
        onChange={handleChange}
        length={CODE_LENGTH}
        error={error}
      />
      {error && (
        <Text accessibilityRole="alert" className="mt-2 text-sm text-danger">
          Enter the {CODE_LENGTH}-digit code
        </Text>
      )}
      <PrimaryButton
        title="Verify"
        onPress={handleVerify}
        disabled={code.length < CODE_LENGTH}
        className="mt-8"
      />
    </AuthLayout>
  );
}
