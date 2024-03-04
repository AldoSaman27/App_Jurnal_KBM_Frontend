import * as ImagePicker from "expo-image-picker";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

// Components
import fetchFromAsyncStorage from "../../components/fetchFromAsyncStorage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { router } from "expo-router";

const FormData = global.FormData;

const UserEdit = () => {
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

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [nipValue, setNipValue] = useState("");
  const [mapelValue, setMapelValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();
      setStorageData(fetchedData);

      setImage(
        `${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${fetchedData.foto}`
      );
      setNameValue(fetchedData.name);
      setNipValue(fetchedData.nip);
      setMapelValue(fetchedData.mapel);
      setEmailValue(fetchedData.email);
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (
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
    } else if (
      emailValue === "" ||
      emailValue.length === 0 ||
      emailValue === null ||
      emailValue === undefined
    ) {
      return Alert.alert("Opss!", "Email is required!");
    }

    setIsLoading(true);

    const formData = new FormData();
    if (imageFile)
      formData.append("foto", {
        uri: image,
        name: imageFile.fileName,
        type: imageFile.mimeType,
      });
    formData.append("name", nameValue);
    formData.append("nip", nipValue);
    formData.append("mapel", mapelValue);
    formData.append("email", emailValue);

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["Accept"] = "application/json";
    await axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/update/${id}`,
        formData
      )
      .then((res) => {
        setIsLoading(false);

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
          "Profile has been updated.",
          [
            {
              text: "Oke",
              onPress: () => router.replace("/(tabs)/dashboard"),
            },
          ],
          {
            cancelable: false,
          }
        );
      })
      .catch((err) => {
        setIsLoading(false);

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
        <View style={styles.image_container}>
          <Image source={image} style={styles.user_image} />
          <TouchableOpacity style={styles.button_image} onPress={pickImage}>
            <Icon1 name="photo-camera" style={styles.btn_img_icon} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.form_group}>
          <Icon1 name="person" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Name"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={(text) => setNameValue(text)}
            defaultValue={nameValue}
          />
        </View>
        <View style={styles.form_group}>
          <Icon1 name="text-snippet" style={styles.icon} size={20} />
          <TextInput
            style={styles.input_group}
            placeholder="NIP"
            inputMode="numeric"
            autoCapitalize="none"
            onChangeText={(text) => setNipValue(text)}
            defaultValue={nipValue}
          />
        </View>
        <View style={styles.form_group}>
          <Icon1 name="subject" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Mapel"
            inputMode="text"
            autoCapitalize="none"
            onChangeText={(text) => setMapelValue(text)}
            defaultValue={mapelValue}
          />
        </View>
        <View style={styles.form_group}>
          <Icon1 name="email" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Email"
            inputMode="email"
            autoCapitalize="none"
            onChangeText={(text) => setEmailValue(text)}
            defaultValue={emailValue}
          />
        </View>
        <TouchableOpacity
          style={styles.button_group}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          <Text style={styles.button_text}>
            {isLoading ? "Please Wait..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default UserEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  image_container: {
    // backgroundColor: "red",
    marginBottom: 20,
  },
  user_image: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#2099FF",
    borderRadius: 100,
  },
  input_group: {
    backgroundColor: "#EAEAEA",
    padding: 5,
    width: "85%",
  },
  form_group: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#EAEAEA",
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button_image: {
    backgroundColor: "#2099FF",
    paddingVertical: 7.5,
    paddingHorizontal: 2.5,
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  btn_img_icon: {
    color: "#FFF",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button_group: {
    width: "100%",
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
});
