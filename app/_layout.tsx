import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";

import * as Location from "expo-location";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const API_KEY = "BvGGLMWeaet2tFqE7OAiKw==tG6UxN6s8a8jOpWy";
  const getCityNameByLatLong = async (lat: number, long: number) => {
    const url =
      "https://api.api-ninjas.com/v1/reversegeocoding?lat=" +
      lat +
      "&lon=" +
      long;
    try {
      const req = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
      });
      const _cities = await req.json();
        return {
        ..._cities[0],
        lat,
        long,
      };
    } catch (error) {}
  };

  const getLoacation = async () => {
    const status: Location.PermissionResponse =
      await Location.requestForegroundPermissionsAsync();
    if (status.status !== "granted") {
      Alert.alert("Permission to access location ws denied");
      router.replace("/tabs/cities");
    }
    //get current locaton
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const long = location.coords.longitude;
    const lat = location.coords.latitude;
    const city = await getCityNameByLatLong(lat, long);
    setLoading(false);
    router.replace({ pathname: "/(tabs)/", params: city });
  };

  useEffect(() => {

    console.clear();
    (async () => {
      await getLoacation();

    })();
  }, []);
  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && loading && <SplashScreen />}
      {loaded &&  <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </>
  );
}
