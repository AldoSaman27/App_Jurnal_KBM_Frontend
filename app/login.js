import axios from "axios";
import Icon1 from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

const login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  useEffect(() => {
    AsyncStorage.clear();
  }, []);

  const handleSubmit = async () => {
    if (
      emailValue === "" ||
      emailValue.length === 0 ||
      emailValue === null ||
      emailValue === undefined
    ) {
      return Alert.alert("Opss!", "Email is required!");
    } else if (
      passwordValue === "" ||
      passwordValue.length === 0 ||
      passwordValue === null ||
      passwordValue === undefined
    ) {
      return Alert.alert("Opss!", "Password is required!");
    }

    setIsLoading(true);

    const formData = { email: emailValue, password: passwordValue };
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
        AsyncStorage.setItem("email", res.data.user.email);
        AsyncStorage.setItem("created_at", res.data.user.created_at);
        AsyncStorage.setItem("updated_at", res.data.user.updated_at);

        router.replace("/");
      })
      .catch((err) => {
        setIsLoading(false);

        if (err.response.data.message)
          return Alert.alert("Opss!", err.response.data.message);

        return Alert.alert(
          "Sorry!",
          "Internal Server Error. Please contact our developer immediately!"
        );
      });
    return 1;
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Icon1 name="journal" size={100} color="#2099FF" style={styles.logo} />
        <View style={styles.form_group}>
          <Icon2 name="email" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Email"
            inputMode="email"
            autoCapitalize="none"
            onChangeText={(text) => setEmailValue(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon2 name="key" style={styles.icon} size={20} color="#000" />
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
          style={styles.button_groupd}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          <Text style={styles.button_text}>
            {isLoading ? "Please Wait..." : "Log In"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.register_text}>
          Tidak punya akun?{" "}
          <Link href={"/register"} style={styles.register_text_link}>
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
  button_groupd: {
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
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "#FFF",
  },
  register_text: {
    marginTop: 20,
  },
  register_text_link: {
    color: "#2099FF",
    fontWeight: "bold",
  },
});
