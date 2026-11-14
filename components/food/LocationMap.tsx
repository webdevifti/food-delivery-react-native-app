import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import Svg, { Circle, G, Path, Polygon } from "react-native-svg";

const MAP_W = 1100;
const MAP_H = 900;

type Props = {
  height: number;
  width: number;
  /** Called with the drag distance (px) from the map's start when released. */
  onMoveEnd?: (offset: { x: number; y: number }) => void;
};

/**
 * Stylised draggable map with a fixed pin. Drag the map under the pin to
 * "move" the location. Decorative only — there is no real geodata behind it.
 */
export default function LocationMap({ height, width, onMoveEnd }: Props) {
  const [dragging, setDragging] = useState(false);
  const min = { x: width - MAP_W, y: height - MAP_H };
  const start = { x: (width - MAP_W) / 2, y: (height - MAP_H) / 2 };

  const pan = useRef(new Animated.ValueXY(start)).current;
  const current = useRef(start);
  const origin = useRef(start);
  const bounds = useRef({ minX: min.x, minY: min.y });
  bounds.current = { minX: min.x, minY: min.y };
  const onEnd = useRef(onMoveEnd);
  onEnd.current = onMoveEnd;

  useEffect(() => {
    const id = pan.addListener((v) => {
      current.current = v;
    });
    return () => pan.removeListener(id);
  }, [pan]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setDragging(true);
        origin.current = { ...current.current };
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({
          x: origin.current.x + g.dx,
          y: origin.current.y + g.dy,
        });
      },
      onPanResponderRelease: () => {
        setDragging(false);
        const { minX, minY } = bounds.current;
        const x = Math.min(0, Math.max(minX, current.current.x));
        const y = Math.min(0, Math.max(minY, current.current.y));
        Animated.spring(pan, {
          toValue: { x, y },
          useNativeDriver: false,
          bounciness: 0,
        }).start();
        onEnd.current?.({ x: x - start.x, y: y - start.y });
      },
      onPanResponderTerminate: () => setDragging(false),
    }),
  ).current;

  return (
    <View
      style={{ width, height, overflow: "hidden", backgroundColor: "#F3F4F6" }}
      {...responder.panHandlers}
    >
      <Animated.View
        style={{
          width: MAP_W,
          height: MAP_H,
          transform: pan.getTranslateTransform(),
        }}
      >
        <Svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
          <G>
            {/* tan districts */}
            <Path d="M0 250 C140 230 220 330 330 300 L330 380 C200 420 90 330 0 350 Z" fill="#FFD08A" />
            <Path d="M520 0 C560 90 610 120 690 160 L640 220 C560 170 500 110 470 0 Z" fill="#FFD08A" />
            <Path d="M820 520 C900 560 960 640 1100 650 L1100 720 C950 720 860 640 800 590 Z" fill="#FFD08A" />
            <Path d="M180 640 C230 600 300 620 310 690 C318 760 240 790 190 740 C160 710 160 670 180 640 Z" fill="#FFD08A" />
            {/* parks */}
            <Polygon points="610,300 760,260 830,360 760,520 620,470" fill="#8FE39B" />
            <Polygon points="40,330 160,300 200,350 120,420 50,400" fill="#9BE56F" />
            <Polygon points="380,820 520,780 560,900 360,900" fill="#8FE39B" />
            <Polygon points="900,120 1040,100 1060,230 920,250" fill="#8FE39B" />
          </G>
          {/* roads */}
          <G stroke="#FFFFFF" strokeLinecap="round" fill="none">
            <Path d="M-20 520 L1120 380" strokeWidth="26" />
            <Path d="M200 -20 L560 920" strokeWidth="22" />
            <Path d="M860 -20 L760 920" strokeWidth="26" />
            <Path d="M-20 140 L1120 300" strokeWidth="16" />
            <Path d="M-20 760 L1120 700" strokeWidth="18" />
            <Path d="M440 -20 L1120 520" strokeWidth="14" />
            <Path d="M0 420 L420 -20" strokeWidth="12" />
            <Path d="M640 600 L1100 860" strokeWidth="12" />
            <Path d="M60 880 L330 480" strokeWidth="12" />
            <Path d="M980 -20 L1120 240" strokeWidth="12" />
          </G>
          {/* roundabout */}
          <Circle cx="330" cy="640" r="62" fill="none" stroke="#FFFFFF" strokeWidth="22" />
        </Svg>
      </Animated.View>

      {/* Pin stays fixed at the centre while the map moves beneath it. */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", left: width / 2 - 26, top: height / 2 - 26 }}
        className="h-[52px] w-[52px] items-center justify-center rounded-full bg-primary/20"
      >
        <View className="h-[22px] w-[22px] rounded-full bg-primary" />
      </View>
      {!dragging && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: width / 2,
            top: height / 2 - 70,
            transform: [{ translateX: -66 }],
          }}
        >
          <View className="rounded-md bg-secondary px-3 py-2">
            <Text className="text-xs text-white">Move to edit location</Text>
          </View>
          <View
            style={{
              alignSelf: "center",
              width: 0,
              height: 0,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 7,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: "#181C2E",
            }}
          />
        </View>
      )}
    </View>
  );
}
