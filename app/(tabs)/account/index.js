import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Icon
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Components
import fetchFromAsyncStorage from "../../../components/fetchFromAsyncStorage";

const account = () => {
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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogout = () => {
    Alert.alert("Are you sure?", "Are you sure you want to logout?", [
      {
        text: "Yes",
        onPress: async () => {
          setIsLoading(true);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          axios.defaults.headers.common["Accept"] = `application/json`;
          await axios
            .post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/logout`)
            .finally(() => {
              setIsLoading(false);

              AsyncStorage.clear();
              return router.replace("/");
            });
        },
      },
      {
        text: "No",
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image
          source={`${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${
            foto || "User_Profile.png"
          }`}
          style={styles.user_image}
        />
        <View style={styles.heading_container}>
          <Text style={styles.heading_text}>Personal Information</Text>
          <Link style={styles.heading_text} href="/user/edit">
            Edit
          </Link>
        </View>
        <View style={styles.personal_infomartion_1}>
          <View style={styles.personal_infomartion_1_heading}>
            <MaterialIcons name="person" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_1_heading_text}>Name</Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_1_text}>
              {name || `User #${id}`}
            </Text>
          </View>
        </View>
        <View style={styles.personal_infomartion}>
          <View style={styles.personal_infomartion_heading}>
            <MaterialIcons name="text-snippet" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_heading_text}>NIP</Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_text}>{nip}</Text>
          </View>
        </View>
        <View style={styles.personal_infomartion_2}>
          <View style={styles.personal_infomartion_2_heading}>
            <MaterialIcons name="text-snippet" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_2_heading_text}>
              Mapel
            </Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_2_text}>
              {mapel || "-"}
            </Text>
          </View>
        </View>
        <View style={styles.heading_container}>
          <Text style={styles.heading_text}>Utilities</Text>
        </View>
        <TouchableOpacity
          style={styles.utilities}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <View style={styles.utilities_heading}>
            <MaterialIcons name="logout" size={30} color={"#FFF"} />
            <Text style={styles.utilities_heading_text}>Log Out</Text>
          </View>
          <View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={"#FFF"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  user_image: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#2099FF",
    borderRadius: 100,
    marginBottom: 20,
  },
  heading_container: {
    width: "100%",
    maxHeight: 60,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading_text: {
    fontSize: 15,
    fontWeight: "500",
  },
  personal_infomartion_1: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    maxHeight: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
  personal_infomartion_1_heading: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  personal_infomartion_1_heading_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#757575",
  },
  personal_infomartion_1_text: {
    fontSize: 15,
    fontWeight: "900",
  },
  personal_infomartion: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    maxHeight: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 5,
  },
  personal_infomartion_heading: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  personal_infomartion_heading_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#757575",
  },
  personal_infomartion_text: {
    fontSize: 15,
    fontWeight: "900",
  },
  personal_infomartion_2: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    maxHeight: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  personal_infomartion_2_heading: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  personal_infomartion_2_heading_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#757575",
  },
  personal_infomartion_2_text: {
    fontSize: 15,
    fontWeight: "900",
  },
  utilities: {
    backgroundColor: "#2099FF",
    width: "100%",
    maxHeight: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  utilities_heading: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  utilities_heading_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFF",
  },
  utilities_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFF",
  },
});
