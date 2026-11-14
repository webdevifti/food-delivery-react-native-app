import { formatPrice, paymentMethods } from "@/assets/data/food";
import CardArt from "@/components/food/CardArt";
import PaymentMethodTile from "@/components/food/PaymentMethodTile";
import SavedCardView from "@/components/food/SavedCardView";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Screen from "@/components/ui/Screen";
import { useCart } from "@/context/CartContext";
import { usePayment } from "@/context/PaymentContext";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { showAlert } from "@/utils/alerts";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Payment() {
  const { manage } = useLocalSearchParams<{ manage?: string }>();
  const managing = manage === "1";
  const { total } = useCart();
  const { method, setMethod, cardFor } = usePayment();
  const placeOrder = usePlaceOrder();

  const selected = paymentMethods.find((m) => m.id === method)!;
  const isCard = method === "visa" || method === "mastercard";
  const card = isCard ? cardFor(method) : undefined;
  const unavailable = method === "paypal";

  const handlePay = () => {
    if (unavailable) {
      showAlert(
        "PayPal unavailable",
        "PayPal isn't supported yet. Pick another method.",
      );
      return;
    }
    if (isCard && !card) {
      showAlert("No card added", `Add a ${selected.name} card to continue.`);
      return;
    }
    placeOrder();
  };

  return (
    <Screen
      title={managing ? "Payment Method" : "Payment"}
      footer={
        managing ? undefined : (
          <View>
            <View className="mb-4 flex-row items-baseline justify-between">
              <Text className="text-sm uppercase tracking-wide text-muted">
                Total:
              </Text>
              <Text className="text-[30px] text-secondary">
                {formatPrice(total)}
              </Text>
            </View>
            <PrimaryButton title="Pay & confirm" onPress={handlePay} />
          </View>
        )
      }
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 6,
          gap: 14,
        }}
      >
        {paymentMethods.map((m) => (
          <PaymentMethodTile
            key={m.id}
            method={m}
            selected={m.id === method}
            onPress={() => setMethod(m.id)}
          />
        ))}
      </ScrollView>

      <View className="mt-6 items-center rounded-2xl bg-field px-6 py-8">
        {card ? (
          <SavedCardView card={card} />
        ) : method === "cash" ? (
          <>
            <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
              <MaterialCommunityIcons
                name="hand-coin-outline"
                size={48}
                color="#FF7622"
              />
            </View>
            <Text className="mt-6 text-base font-bold text-secondary">
              Pay with cash
            </Text>
            <Text className="mt-1 text-center text-base leading-6 text-textLight">
              Pay the courier when your order arrives.
            </Text>
          </>
        ) : unavailable ? (
          <>
            <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
              <Feather name="clock" size={40} color="#A0A5BA" />
            </View>
            <Text className="mt-6 text-base font-bold text-secondary">
              PayPal is coming soon
            </Text>
            <Text className="mt-1 text-center text-base leading-6 text-textLight">
              Choose cash or a card for now.
            </Text>
          </>
        ) : (
          <>
            <CardArt width={170} />
            <Text className="mt-6 text-base font-bold text-secondary">
              No {selected.name.toLowerCase()} added
            </Text>
            <Text className="mt-1 text-center text-base leading-6 text-textLight">
              You can add a {selected.name.toLowerCase()} and save it for later
            </Text>
          </>
        )}
      </View>

      {isCard && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Add new ${selected.name} card`}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(main)/add-card",
              params: managing ? { method, manage: "1" } : { method },
            })
          }
          className="mt-5 min-h-[62px] flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-[#EDEDED] bg-white"
        >
          <Feather name="plus" size={18} color="#FF7622" />
          <Text className="text-sm font-bold uppercase tracking-wider text-secondary">
            {card ? "Replace card" : "Add new"}
          </Text>
        </TouchableOpacity>
      )}
    </Screen>
  );
}
