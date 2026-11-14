import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

const logo = require("../assets/images/logo.png");
const background = require("../assets/images/splash-bg.png");

type Props = {
  /** Fires once the view is laid out, i.e. safe to hide the native splash. */
  onReady?: () => void;
};

/**
 * Branded splash: white screen, centered logo, and sunburst rays in the
 * top-left / bottom-right corners that fade in. The logo is static so it
 * lines up exactly with the native splash image (see `imageWidth` in app.json).
 */
export default function SplashView({ onReady }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <View style={styles.container} onLayout={onReady}>
      <StatusBar style="dark" />
      <Animated.Image
        source={background}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, styles.background, { opacity }]}
      />
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 122,
    height: 59,
  },
});
