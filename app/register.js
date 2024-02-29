import axios from "axios";
import Icon1 from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/FontAwesome";
import Icon4 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [nipValue, setNipValue] = useState("");
  const [mapelValue, setMapelValue] = useState("");

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
    } else if (
      nameValue === "" ||
      nameValue.length === 0 ||
      nameValue === null ||
      nameValue === undefined
    ) {
      return Alert.alert("Opss!", "Name is required!");
    } else if (
      nipValue === "" ||
      nipValue.length < 18 ||
      nipValue === null ||
      nipValue === undefined
    ) {
      return Alert.alert("Opss!", "NIP is required or NIP must be 18 digits!");
    } else if (
      mapelValue === "" ||
      mapelValue.length === 0 ||
      mapelValue === null ||
      mapelValue === undefined
    ) {
      return Alert.alert("Opss!", "Mapel is required!");
    }

    setIsLoading(true);

    const formData = {
      email: emailValue,
      password: passwordValue,
      name: nameValue,
      nip: nipValue,
      mapel: mapelValue,
    };
    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, formData)
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

        Alert.alert(
          "Success!",
          "Your account has been created.",
          [
            {
              text: "Oke",
              onPress: () => router.replace("/"),
            },
          ],
          {
            cancelable: false,
          }
        );
      })
      .catch((err) => {
        setIsLoading(false);

        if (err.response.data.errors.email)
          return Alert.alert("Sorry!", err.response.data.errors.email[0]);
        else if (err.response.data.errors.nip)
          return Alert.alert("Sorry!", err.response.data.errors.nip[0]);

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
        <Text style={styles.heading_text}>Account Information</Text>
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
        <Text style={styles.heading_text}>Personal Information</Text>
        <View style={styles.form_group}>
          <Icon3 name="user" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Name"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={(text) => setNameValue(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon4 name="text-snippet" style={styles.icon} size={20} />
          <TextInput
            style={styles.input_group}
            placeholder="NIP"
            inputMode="numeric"
            autoCapitalize="none"
            onChangeText={(text) => setNipValue(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon4 name="subject" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Mapel"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={(text) => setMapelValue(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.button_group}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          <Text style={styles.button_text}>
            {isLoading ? "Please Wait..." : "Register"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.login_text}>
          Punya akun?{" "}
          <Link href={"/login"} style={styles.login_text_link}>
            Masuk
          </Link>
        </Text>
      </View>
    </SafeAreaProvider>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 20,
  },
  heading_text: {
    width: "90%",
    fontWeight: "bold",
    marginBottom: 10,
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
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "#FFF",
  },
  login_text: {
    marginTop: 20,
  },
  login_text_link: {
    color: "#2099FF",
    fontWeight: "bold",
  },
});
