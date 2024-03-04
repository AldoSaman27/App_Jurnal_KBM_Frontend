import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Components
import fetchFromAsyncStorage from "../components/fetchFromAsyncStorage";

const index = () => {
  const [storageData, setStorageData] = useState({
    accessToken: null,
    id: null,
    name: null,
    nip: null,
    mapel: null,
    foto: null,
    email: null,
    created_at: null,
    updated_at: null,
  });

  const {
    accessToken,
    id,
    name,
    nip,
    mapel,
    foto,
    email,
    created_at,
    updated_at,
  } = storageData;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();
      setStorageData(fetchedData);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaProvider>
      <View>
        <Text>{accessToken}</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default index;
