import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

// Icon
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nipValue, setNipValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = async () => {
    if (
      nipValue === "" ||
      nipValue.length < 18 ||
      nipValue === null ||
      nipValue === undefined
    ) {
      return Alert.alert("Opss!", "NIP is required or NIP must be 18 digits!");
    } else if (
      passwordValue === "" ||
      passwordValue.length < 5 ||
      passwordValue === null ||
      passwordValue === undefined
    ) {
      return Alert.alert(
        "Opss!",
        "Password is required or Password must be 5 letters!"
      );
    }

    setIsLoading(true);

    const formData = { nip: nipValue, password: passwordValue };
    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, formData)
      .then((res) => {
        setIsLoading(false);

        AsyncStorage.setItem("accessToken", res.data.user.accessToken);
        AsyncStorage.setItem("id", res.data.user.id.toString());
        AsyncStorage.setItem("name", res.data.user.name);
        AsyncStorage.setItem("nip", res.data.user.nip);
        AsyncStorage.setItem("mapel", res.data.user.mapel);
        AsyncStorage.setItem("foto", res.data.user.foto);
        AsyncStorage.setItem("created_at", res.data.user.created_at);
        AsyncStorage.setItem("updated_at", res.data.user.updated_at);

        router.replace("/(tabs)/dashboard");
      })
      .catch((err) => {
        setIsLoading(false);

        if (err.response.data.message)
          return Alert.alert("Opss!", err.response.data.message);

        return Alert.alert(
          "Sorry!",
          "Internal Server Error. Please contact the development team!"
        );
      });
    return 1;
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Ionicons
          name="journal"
          size={100}
          color="#2099FF"
          style={styles.logo}
        />
        <View style={styles.form_group}>
          <MaterialIcons name="text-snippet" style={styles.icon} size={20} />
          <TextInput
            style={styles.input_group}
            placeholder="NIP"
            inputMode="numeric"
            autoCapitalize="none"
            onChangeText={(text) => setNipValue(text)}
          />
        </View>
        <View style={styles.form_group}>
          <MaterialIcons name="key" style={styles.icon} size={20} />
          <TextInput
            style={styles.input_group}
            placeholder="Password"
            inputMode="text"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(text) => setPasswordValue(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.button_group}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          <Text style={styles.button_text}>
            {isLoading ? "Log In..." : "Log In"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.register_text}>
          Tidak punya akun?{" "}
          <Link href={"/auth/register"} style={styles.register_text_link}>
            Buat Akun
          </Link>
        </Text>
      </View>
    </SafeAreaProvider>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 20,
  },
  input_group: {
    backgroundColor: "#FFF",
    padding: 5,
    width: "85%",
  },
  form_group: {
    display: "center",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 10,
    margin: 5,
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button_group: {
    width: "90%",
    padding: 12,
    backgroundColor: "#2099FF",
    borderRadius: 10,
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button_text: {
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
    color: "#FFF",
  },
  register_text: {
    marginTop: 20,
  },
  register_text_link: {
    color: "#2099FF",
    fontWeight: "900",
  },
});
