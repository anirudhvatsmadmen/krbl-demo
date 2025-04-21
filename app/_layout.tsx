import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import Providers from "../redux/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationContainerRef } from "@react-navigation/native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const ref = useNavigationContainerRef();
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome.font,
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (!fontsLoaded) return;

      try {
        const userData = await AsyncStorage.getItem("user");

        await SplashScreen.hideAsync(); // hide splash first
        setAppReady(true); // set layout as ready before navigating

        // ✅ Delay navigation slightly to ensure RootLayout is mounted
        setTimeout(() => {
          if (userData) {
            console.log("User exists, going to home page");
            router.replace("/"); // or /home if you have that
          } else {
            console.log("No user found, redirecting to login");
            router.replace("/auth/sign-in");
          }
        }, 50);
      } catch (error) {
        console.error("Failed to check user:", error);
        await SplashScreen.hideAsync();
        setAppReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!fontsLoaded || !appReady) return <View />;

  return (
    <Providers>
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>
    </Providers>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
