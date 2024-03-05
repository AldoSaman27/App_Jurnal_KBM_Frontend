import axios from "axios";
import { useEffect } from "react";
import { Stack, SplashScreen, router } from "expo-router";

// Components
import fetchFromAsyncStorage from "../components/fetchFromAsyncStorage";

SplashScreen.preventAutoHideAsync();

export default function layout() {
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();
      const accessToken = fetchedData.accessToken;

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios.defaults.headers.common["Accept"] = `application/json`;
      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/checktoken`)
        .then(() => {
          router.replace("/(tabs)/dashboard");
        })
        .catch(() => {
          router.replace("/");
        })
        .finally(() => {
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 2500);
        });
    };

    fetchData();
  }, []);

  return (
    <Stack screenOptions={{ headerTitle: "" }}>
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
