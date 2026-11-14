import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Polygon } from "react-native-svg";
import { offer } from "@/assets/data/food";

type Props = {
  visible: boolean;
  onClose: () => void;
};

/** "Hurry Offers!" coupon popup shown over the home screen. */
export default function OfferModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close offer"
        onPress={onClose}
        className="flex-1 items-center justify-center bg-secondary/60 px-6"
      >
        {/* Inner Pressable swallows taps so only the backdrop closes it. */}
        <Pressable className="w-full max-w-[420px]" onPress={() => {}}>
          <LinearGradient
            colors={["#FFD52E", "#FF9A0A", "#EE6F00"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ borderRadius: 30, overflow: "hidden" }}
          >
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 327 380"
              preserveAspectRatio="none"
              style={{ position: "absolute" }}
              pointerEvents="none"
            >
              <Polygon points="52,95 98,70 92,118" fill="#FFE98A" opacity="0.7" />
              <Polygon points="268,70 296,110 262,128" fill="#FFE17A" opacity="0.75" />
              <Polygon points="168,62 190,70 176,100" fill="#FFE98A" opacity="0.55" />
              <Polygon points="92,228 112,208 124,250" fill="#FFD36B" opacity="0.55" />
              <Polygon points="236,224 252,246 226,252" fill="#FFD36B" opacity="0.5" />
              <Path
                d="M310 210 C300 220 316 228 306 240 C298 250 312 256 304 268"
                stroke="#FFC94D"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </Svg>

            <View className="items-center px-6 pb-8 pt-16">
              <Text
                accessibilityRole="header"
                className="text-center text-[40px] font-extrabold leading-[48px] text-white"
              >
                {offer.title}
              </Text>
              <Text
                selectable
                className="mt-8 text-center text-[30px] font-bold tracking-wide text-white"
              >
                {offer.code}
              </Text>
              <Text className="mt-8 text-center text-base font-bold text-white">
                {offer.description}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Got it"
                activeOpacity={0.85}
                onPress={onClose}
                className="mt-8 min-h-[62px] w-full items-center justify-center rounded-[10px] border-2 border-white"
              >
                <Text className="text-sm font-bold uppercase tracking-wider text-white">
                  Got it
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={10}
            onPress={onClose}
            className="absolute right-4 top-4 h-11 w-11 items-center justify-center rounded-full bg-[#FFE3A4]"
          >
            <AntDesign name="close" size={18} color="#EE6F00" />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
