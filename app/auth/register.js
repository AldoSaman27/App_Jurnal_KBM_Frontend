// axios
import axios from "axios";

// async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// react
import { useState } from "react";

// expo-router
import { Link, router } from "expo-router";

// react-native-safe-area-context
import { SafeAreaProvider } from "react-native-safe-area-context";

// react-native
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";

// Ionicons
import Ionicons from "react-native-vector-icons/Ionicons";

const FormData = global.FormData;

const register = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [nipValue, setNipValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const [passwordShow, setpasswordShow] = useState(true);

    const handleSubmit = async () => {
        if (nipValue === "" || nipValue.length < 18 || nipValue === null || nipValue === undefined) {
            return Alert.alert("Oops!", "NIP is required or NIP must be 18 digits!");
        } else if (passwordValue === "" || passwordValue.length < 5 || passwordValue === null || passwordValue === undefined) {
            return Alert.alert("Oops!", "Password is required or Password must be 5 letters!");
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("nip", nipValue);
        formData.append("password", passwordValue);

        axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
        axios.defaults.headers.common["Accept"] = "application/json";
        await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/register`, formData).then((res) => {
            setIsLoading(false);

            AsyncStorage.setItem("accessToken", res.data.user.accessToken || "");
            AsyncStorage.setItem("id", res.data.user.id.toString() || "");
            AsyncStorage.setItem("name", res.data.user.name || "");
            AsyncStorage.setItem("nip", res.data.user.nip || "");
            AsyncStorage.setItem("mapel", res.data.user.mapel || "");
            AsyncStorage.setItem("sekolah", res.data.user.sekolah || "");
            AsyncStorage.setItem("foto", res.data.user.foto || "");
            AsyncStorage.setItem("created_at", res.data.user.created_at || "");
            AsyncStorage.setItem("updated_at", res.data.user.updated_at || "");

            Alert.alert("Success!", "Your account has been created.", [
                {
                    onPress: () => router.replace("/(tabs)/dashboard"),
                },
            ]);
        }).catch((err) => {
            setIsLoading(false);

            if (err.response.data.message) return Alert.alert("Opss!", err.response.data.message);

            return Alert.alert(
                "Oops!",
                "Something went wrong, please try again later.",
            );
        });
        return 1;
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Ionicons name="journal" size={100} color="#2099FF" style={styles.logo} />

                <View style={styles.input_group}>
                    <Text style={styles.input_group_text}>NIP</Text>
                    <View style={styles.form_group}>
                        <TextInput style={styles.form_group_input} placeholder="Masukkan NIP" inputMode="numeric" autoCapitalize="none" onChangeText={(text) => setNipValue(text)} />
                    </View>
                </View>

                <View style={styles.input_group}>
                <Text style={styles.input_group_text}>Password</Text>
                    <View style={styles.form_group}>
                        <TextInput style={styles.form_group_input} placeholder="Masukkan Password" inputMode="text" secureTextEntry={passwordShow} autoCapitalize="none" onChangeText={(text) => setPasswordValue(text)} />
                        <Ionicons name={passwordShow ? "eye-off" : "eye"} style={styles.icon} size={20} onPress={() => setpasswordShow(!passwordShow)} />
                    </View>
                </View>

                <TouchableOpacity style={styles.button_group} disabled={isLoading} onPress={handleSubmit}>
                    <Text style={styles.button_text}>
                        {isLoading ? "..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.login_text}>
                    Punya akun?{" "}
                    <Link href={"/auth/login"} style={styles.login_text_link}>Masuk</Link>
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
    input_group: {
        width: "90%",
        marginBottom: 5,
    },
    input_group_text: {
        fontWeight: "600",
    },
    form_group: {
        display: "center",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#FFF",
        padding: 5,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    form_group_input: {
        backgroundColor: "#FFF",
        padding: 6.5,
        width: "90%",
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
        marginTop: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    button_text: {
        fontWeight: "700",
        fontSize: 15,
        textAlign: "center",
        color: "#FFF",
    },
    login_text: {
        marginTop: 20,
    },
    login_text_link: {
        color: "#2099FF",
        fontWeight: "700",
    },
});
