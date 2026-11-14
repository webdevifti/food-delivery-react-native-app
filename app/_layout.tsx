import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import SplashView from "../components/SplashView";
import { AccountProvider } from "../context/AccountContext";
import { CartProvider } from "../context/CartContext";
import { OrdersProvider } from "../context/OrdersContext";
import { PaymentProvider } from "../context/PaymentContext";
import { UserProvider } from "../context/UserContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const SPLASH_DURATION_MS = 2200;

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  if (showSplash) {
    // Hide the native splash only once our branded one is on screen.
    return <SplashView onReady={() => SplashScreen.hideAsync()} />;
  }

  return (
    <UserProvider>
      <CartProvider>
        <PaymentProvider>
          <AccountProvider>
            <OrdersProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: "#FFFFFF" },
                }}
              />
            </OrdersProvider>
          </AccountProvider>
        </PaymentProvider>
      </CartProvider>
    </UserProvider>
  );
}
