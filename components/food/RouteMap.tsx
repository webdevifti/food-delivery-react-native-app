import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Path, Polygon, Polyline } from "react-native-svg";

/** Route in map units (viewBox 375 × 320): restaurant → … → your door. */
const ROUTE: [number, number][] = [
  [78, 64],
  [78, 150],
  [176, 150],
  [176, 232],
  [296, 232],
  [296, 262],
];
const VB_W = 375;
const VB_H = 320;

function pointAt(progress: number): [number, number] {
  const lengths = ROUTE.slice(1).map((p, i) =>
    Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]),
  );
  const total = lengths.reduce((a, b) => a + b, 0);
  let remaining = Math.min(1, Math.max(0, progress)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const t = lengths[i] === 0 ? 0 : remaining / lengths[i];
      return [
        ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * t,
        ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * t,
      ];
    }
    remaining -= lengths[i];
  }
  return ROUTE[ROUTE.length - 1];
}

type Props = {
  width: number;
  /** Courier position along the route, 0 to 1. */
  progress: number;
  showCourier: boolean;
};

/** Stylised map with the delivery route and a moving courier. Decorative. */
export default function RouteMap({ width, progress, showCourier }: Props) {
  const scale = width / VB_W;
  const height = VB_H * scale;
  const [cx, cy] = pointAt(progress);
  const start = ROUTE[0];
  const end = ROUTE[ROUTE.length - 1];
  const place = (x: number, y: number, size: number) => ({
    position: "absolute" as const,
    left: x * scale - size / 2,
    top: y * scale - size / 2,
    width: size,
    height: size,
  });

  return (
    <View style={{ width, height, backgroundColor: "#F3F4F6" }}>
      <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <G>
          <Path d="M0 190 C60 180 100 230 150 215 L150 270 C80 290 30 240 0 260 Z" fill="#FFD08A" />
          <Path d="M250 0 C270 40 310 60 375 80 L375 130 C300 110 250 80 230 0 Z" fill="#FFD08A" />
          <Polygon points="230,70 300,50 330,110 290,160 235,140" fill="#8FE39B" />
          <Polygon points="10,90 60,70 80,110 40,150 5,130" fill="#9BE56F" />
          <Polygon points="40,270 120,250 150,320 30,320" fill="#8FE39B" />
        </G>
        <G stroke="#FFFFFF" strokeLinecap="round" fill="none">
          <Path d="M-10 150 L385 150" strokeWidth="16" />
          <Path d="M78 -10 L78 330" strokeWidth="16" />
          <Path d="M176 -10 L176 330" strokeWidth="14" />
          <Path d="M-10 232 L385 232" strokeWidth="14" />
          <Path d="M296 -10 L296 330" strokeWidth="14" />
          <Path d="M-10 64 L385 64" strokeWidth="10" />
          <Path d="M-10 290 L385 290" strokeWidth="10" />
        </G>
        {/* route: full dashed path + travelled part in orange */}
        <Polyline
          points={ROUTE.map((p) => p.join(",")).join(" ")}
          stroke="#FFB68A"
          strokeWidth="5"
          strokeDasharray="2 8"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={cx} cy={cy} r="14" fill="#FF7622" opacity="0.18" />
      </Svg>

      <View
        style={place(start[0], start[1], 36)}
        className="items-center justify-center rounded-full bg-secondary"
      >
        <Feather name="shopping-bag" size={16} color="white" />
      </View>
      <View
        style={place(end[0], end[1], 36)}
        className="items-center justify-center rounded-full bg-primary"
      >
        <Feather name="home" size={16} color="white" />
      </View>
      {showCourier && (
        <View
          style={place(cx, cy, 36)}
          className="items-center justify-center rounded-full border-2 border-white bg-[#369BFF]"
        >
          <FontAwesome5 name="motorcycle" size={14} color="white" />
        </View>
      )}
    </View>
  );
}
