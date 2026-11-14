import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";
import { STAGES } from "@/utils/orders";

type Props = {
  /** Current stage 0-3. */
  stage: number;
  canceled?: boolean;
};

/** Vertical status timeline: done (orange tick), current (ring), upcoming. */
export default function OrderTimeline({ stage, canceled }: Props) {
  if (canceled) {
    return (
      <View className="flex-row items-center gap-4 rounded-2xl bg-[#FFF0F0] p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-danger">
          <Feather name="x" size={20} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-secondary">Order canceled</Text>
          <Text className="mt-0.5 text-sm text-textLight">
            This order was canceled and won&apos;t be delivered.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      {STAGES.map((s, i) => {
        const done = i < stage || stage >= 3;
        const current = i === stage && stage < 3;
        const last = i === STAGES.length - 1;
        return (
          <View key={s.title} className="flex-row gap-4">
            <View className="items-center">
              <View
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  done
                    ? "bg-primary"
                    : current
                      ? "border-2 border-primary bg-white"
                      : "border-2 border-[#E1E4EA] bg-white"
                }`}
              >
                {done ? (
                  <Feather name="check" size={16} color="white" />
                ) : current ? (
                  <View className="h-3 w-3 rounded-full bg-primary" />
                ) : null}
              </View>
              {!last && (
                <View
                  className={`my-1 w-0.5 flex-1 ${
                    i < stage ? "bg-primary" : "bg-[#E1E4EA]"
                  }`}
                  style={{ minHeight: 28 }}
                />
              )}
            </View>
            <View className="flex-1 pb-5">
              <Text
                className={`text-base ${
                  done || current ? "font-bold text-secondary" : "text-muted"
                }`}
              >
                {s.title}
              </Text>
              <Text className="mt-0.5 text-sm text-textLight">{s.subtitle}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
