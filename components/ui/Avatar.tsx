import { Image } from "expo-image";
import React from "react";

const defaultAvatar = require("../../assets/images/profile.png");

type Props = {
  /** Local/remote image URI. Falls back to the default avatar. */
  uri?: string;
  size?: number;
};

export default function Avatar({ uri, size = 100 }: Props) {
  return (
    <Image
      accessibilityLabel="Profile photo"
      source={uri ? { uri } : defaultAvatar}
      contentFit="cover"
      transition={150}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#FFC8B0",
      }}
    />
  );
}
