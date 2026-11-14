import places from "@/assets/data/places.json";
import LocationMap from "@/components/food/LocationMap";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AddressLabel, useUser } from "@/context/UserContext";
import { hasErrors } from "@/utils/validation";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LABELS: AddressLabel[] = ["Home", "Work", "Other"];

/** Add a new address, or edit one when an `id` param is passed. */
export default function EditAddress() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addresses, addAddress, updateAddress } = useUser();
  const existing = addresses.find((a) => a.id === id);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const streetRef = useRef<TextInput>(null);
  const postCodeRef = useRef<TextInput>(null);
  const apartmentRef = useRef<TextInput>(null);

  const [label, setLabel] = useState<AddressLabel>(existing?.label ?? "Home");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [street, setStreet] = useState(existing?.street ?? "");
  const [postCode, setPostCode] = useState(existing?.postCode ?? "");
  const [apartment, setApartment] = useState(existing?.apartment ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Collapse the map while typing so the form keeps the screen.
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const errors = {
    address: address.trim() ? undefined : "Address is required",
    street: street.trim() ? undefined : "Street is required",
    postCode: postCode.trim() ? undefined : "Required",
  };
  const show = (key: keyof typeof errors) =>
    submitted ? errors[key] : undefined;

  /** Dragging the map picks a nearby dummy place (no real geocoding yet). */
  const handleMapMoved = ({ x, y }: { x: number; y: number }) => {
    const index =
      Math.abs(Math.round(x / 40) + Math.round(y / 40) * 7) % places.length;
    const place = places[index];
    setAddress(place.address);
    setStreet(place.street);
    setPostCode(place.postCode);
  };

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors(errors)) return;
    const data = {
      label,
      address: address.trim(),
      street: street.trim(),
      postCode: postCode.trim(),
      apartment: apartment.trim(),
    };
    if (existing) updateAddress(existing.id, data);
    else addAddress(data);
    router.back();
  };

  const mapHeight = 270 + insets.top;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      {!keyboardOpen && (
        <View>
          <LocationMap width={width} height={mapHeight} onMoveEnd={handleMapMoved} />
          {router.canGoBack() && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => router.back()}
              style={{ top: insets.top + 12 }}
              className="absolute left-6 h-[45px] w-[45px] items-center justify-center rounded-full bg-secondary"
            >
              <Entypo name="chevron-small-left" size={26} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        {keyboardOpen && router.canGoBack() && (
          <View style={{ paddingTop: insets.top + 8 }} className="px-6 pb-2">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => router.back()}
              className="h-[45px] w-[45px] items-center justify-center rounded-full bg-surface"
            >
              <Entypo name="chevron-small-left" size={26} color="#181C2E" />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          }}
        >
          <FormField
            label="Address"
            placeholder="3235 Royal Ln. Mesa, New Jersey 34567"
            value={address}
            onChangeText={setAddress}
            error={show("address")}
            autoCapitalize="words"
            textContentType="fullStreetAddress"
            icon={<FontAwesome5 name="map-marker-alt" size={16} color="#6B6E82" />}
            returnKeyType="next"
            onSubmitEditing={() => streetRef.current?.focus()}
          />
          <View className="flex-row gap-4">
            <FormField
              ref={streetRef}
              label="Street"
              placeholder="Hason Nagar"
              value={street}
              onChangeText={setStreet}
              error={show("street")}
              autoCapitalize="words"
              containerClassName="mb-6 min-w-0 flex-1"
              returnKeyType="next"
              onSubmitEditing={() => postCodeRef.current?.focus()}
            />
            <FormField
              ref={postCodeRef}
              label="Post Code"
              placeholder="34567"
              value={postCode}
              onChangeText={setPostCode}
              error={show("postCode")}
              keyboardType="number-pad"
              containerClassName="mb-6 min-w-0 flex-1"
              returnKeyType="next"
              onSubmitEditing={() => apartmentRef.current?.focus()}
            />
          </View>
          <FormField
            ref={apartmentRef}
            label="Apartment"
            placeholder="345"
            value={apartment}
            onChangeText={setApartment}
            returnKeyType="done"
          />

          <Text className="mb-3 text-[13px] uppercase tracking-wide text-secondary">
            Label as
          </Text>
          <View className="flex-row gap-3">
            {LABELS.map((l) => {
              const active = l === label;
              return (
                <TouchableOpacity
                  key={l}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  activeOpacity={0.8}
                  onPress={() => setLabel(l)}
                  className={`min-w-[94px] items-center rounded-full px-6 py-4 ${
                    active ? "bg-[#F58D1D]" : "bg-field"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      active ? "font-semibold text-white" : "text-secondary"
                    }`}
                  >
                    {l}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <PrimaryButton
            title="Save location"
            onPress={handleSave}
            className="mt-8"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
