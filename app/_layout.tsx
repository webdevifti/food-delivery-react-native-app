import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import logo from "../assets/images/logo.png";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    );
  } else {
    return <Stack screenOptions={{ headerShown: false }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
