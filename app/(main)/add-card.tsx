import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { useCart } from "@/context/CartContext";
import { usePayment } from "@/context/PaymentContext";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import {
  cardBrandOf,
  cardNumberError,
  cvcError,
  digitsOnly,
  expiryError,
  formatCardNumber,
  formatExpiry,
  hasErrors,
} from "@/utils/validation";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

export default function AddCard() {
  const { manage } = useLocalSearchParams<{ manage?: string }>();
  const managing = manage === "1";
  const { addCard } = usePayment();
  const { count } = useCart();
  const placeOrder = usePlaceOrder();

  const numberRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvcRef = useRef<TextInput>(null);

  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    holder: holder.trim() ? undefined : "Name is required",
    number: cardNumberError(number),
    expiry: expiryError(expiry),
    cvc: cvcError(cvc),
  };
  const show = (key: keyof typeof errors) =>
    submitted ? errors[key] : undefined;

  const handleSubmit = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    // Only the last 4 digits are kept; never store the full number or CVC.
    addCard({
      brand: cardBrandOf(number),
      holder: holder.trim(),
      last4: digitsOnly(number).slice(-4),
      expiry,
    });
    if (count > 0 && !managing) placeOrder();
    else router.back();
  };

  return (
    <Screen
      title="Add Card"
      closeButton
      footer={
        <PrimaryButton
          title={managing ? "Save card" : "Add & make payment"}
          onPress={handleSubmit}
        />
      }
    >
      <FormField
        label="Card holder name"
        placeholder="Vishal Khadok"
        value={holder}
        onChangeText={setHolder}
        error={show("holder")}
        autoCapitalize="words"
        autoComplete="cc-name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => numberRef.current?.focus()}
      />
      <FormField
        ref={numberRef}
        label="Card number"
        placeholder="0000 0000 0000 0000"
        value={number}
        onChangeText={(t) => setNumber(formatCardNumber(t))}
        error={show("number")}
        keyboardType="number-pad"
        autoComplete="cc-number"
        textContentType="creditCardNumber"
        maxLength={19}
        returnKeyType="next"
        onSubmitEditing={() => expiryRef.current?.focus()}
      />
      <View className="flex-row gap-4">
        <FormField
          ref={expiryRef}
          label="Expire date"
          placeholder="MM/YY"
          value={expiry}
          onChangeText={(t) => setExpiry(formatExpiry(t))}
          error={show("expiry")}
          keyboardType="number-pad"
          autoComplete="cc-exp"
          maxLength={5}
          containerClassName="mb-6 min-w-0 flex-1"
          returnKeyType="next"
          onSubmitEditing={() => cvcRef.current?.focus()}
        />
        <FormField
          ref={cvcRef}
          label="CVC"
          placeholder="123"
          value={cvc}
          onChangeText={(t) => setCvc(digitsOnly(t).slice(0, 4))}
          error={show("cvc")}
          keyboardType="number-pad"
          autoComplete="cc-csc"
          maxLength={4}
          containerClassName="mb-6 min-w-0 flex-1"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>
    </Screen>
  );
}
