import React from "react";
import Svg, { Circle, G, Polygon, Rect } from "react-native-svg";

/** Flat orange credit-card illustration for empty payment states. */
export default function CardArt({ width = 170 }: { width?: number }) {
  const height = (width * 105) / 170;
  return (
    <Svg width={width} height={height} viewBox="0 0 170 105">
      <Rect width="170" height="105" rx="10" fill="#FF7622" />
      <G>
        <Polygon points="86,0 112,0 170,58 170,86" fill="#E8001B" />
        <Polygon points="138,0 170,0 170,32" fill="#FFCB5C" />
        <Polygon points="132,105 170,66 170,105" fill="#FFFFFF" />
        <Polygon points="124,105 140,105 170,75 170,60" fill="#FFCB5C" opacity="0.0" />
      </G>
      <Circle cx="14" cy="14" r="6" fill="#EB001B" />
      <Circle cx="21" cy="14" r="6" fill="#FFFFFF" opacity="0.85" />
      <Rect x="10" y="32" width="102" height="17" rx="2" fill="#FFFFFF" opacity="0.4" />
      <Rect x="10" y="62" width="38" height="8" rx="2" fill="#FFFFFF" opacity="0.4" />
      <Rect x="10" y="76" width="30" height="8" rx="2" fill="#FFFFFF" opacity="0.4" />
    </Svg>
  );
}
