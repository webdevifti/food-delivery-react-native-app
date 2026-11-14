import React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
} from "react-native-svg";

type Props = { size?: number };

/** Flat map-with-pin illustration for the location-access screen. */
export default function MapIllustration({ size = 300 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Defs>
        <ClipPath id="map-clip">
          <Circle cx="150" cy="150" r="150" />
        </ClipPath>
      </Defs>
      <Circle cx="150" cy="150" r="150" fill="#F7FAFF" />
      <G clipPath="url(#map-clip)">
        {/* faint city-block grid */}
        <G stroke="#EAF0F9" strokeWidth="2">
          <Path d="M-20 60 L320 -10" />
          <Path d="M-20 120 L320 50" />
          <Path d="M-20 250 L320 180" />
          <Path d="M60 -20 L140 320" />
          <Path d="M200 -20 L280 320" />
        </G>
        {/* park */}
        <Path d="M195 -5 L275 20 L250 55 L190 30 Z" fill="#86CDAA" />
        {/* roads */}
        <G stroke="#FFE27A" strokeWidth="24" strokeLinecap="round" fill="none">
          <Path d="M40 -10 L135 320" />
          <Path d="M-20 235 L320 150" />
          <Path d="M175 330 Q250 265 330 245" />
        </G>
        {/* pin shadow */}
        <Path d="M150 224 L222 128 L196 190 Z" fill="#000000" opacity="0.12" />
        {/* pin */}
        <Path
          d="M150 224 C132 192 105 172 105 136 A45 45 0 1 1 195 136 C195 172 168 192 150 224 Z"
          fill="#FF5722"
        />
        <Circle cx="150" cy="136" r="15" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}
