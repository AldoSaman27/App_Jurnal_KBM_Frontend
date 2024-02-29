import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchFromAsyncStorage = async () => {
  const fetchAccessToken = await AsyncStorage.getItem("accessToken");
  const fetchId = await AsyncStorage.getItem("id");
  const fetchName = await AsyncStorage.getItem("name");
  const fetchNip = await AsyncStorage.getItem("nip");
  const fetchMapel = await AsyncStorage.getItem("mapel");
  const fetchFoto = await AsyncStorage.getItem("foto");
  const fetchEmail = await AsyncStorage.getItem("email");
  const fetchCreated_at = await AsyncStorage.getItem("created_at");
  const fetchUpdated_at = await AsyncStorage.getItem("updated_at");

  return {
    accessToken: fetchAccessToken,
    id: fetchId,
    name: fetchName,
    nip: fetchNip,
    mapel: fetchMapel,
    foto: fetchFoto,
    email: fetchEmail,
    created_at: fetchCreated_at,
    updated_at: fetchUpdated_at,
  };
};

export default fetchFromAsyncStorage;
