import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import fetchFromAsyncStorage from "../components/fetchFromAsyncStorage";

export default function layout() {
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${fetchedData.accessToken}`;
      axios.defaults.headers.common["Accept"] = `application/json`;
      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/checktoken`)
        .catch(() => {
          if (fetchedData.accessToken) AsyncStorage.clear();
          return router.replace("/login");
        });
    };

    fetchData();
  }, []);

  return (
    <Stack screenOptions={{ headerTitle: "" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
