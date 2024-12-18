// expo-router
import { Link } from "expo-router";

// react-native-safe-area-context
import { SafeAreaProvider } from "react-native-safe-area-context";

// react-native
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Ionicons
import Ionicons from "react-native-vector-icons/Ionicons";

const index = () => {
    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Ionicons name="journal" size={100} color="#2099FF" />
                <Text style={styles.heading_text}>Selamat datang di Jurnal!</Text>
                <Text style={styles.description_text}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores error molestiae eum architecto deleniti minus.</Text>
                <TouchableOpacity style={styles.button_group}>
                    <Link href={"/auth/login"} style={styles.button_group_text}>Sign In</Link>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_group_2}>
                    <Link href={"/auth/register"} style={styles.button_group_2_text}>Sign Up</Link>
                </TouchableOpacity>
            </View>
        </SafeAreaProvider>
    );
};

export default index;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    heading_text: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "500",
    },
    description_text: {
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    button_group: {
        backgroundColor: "#2099FF",
        width: "100%",
        height: 50,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    button_group_text: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFF",
        width: "100%",
        textAlign: "center",
    },
    button_group_2: {
        borderWidth: 5,
        borderColor: "#2099FF",
        width: "100%",
        height: 50,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    button_group_2_text: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2099FF",
        width: "100%",
        textAlign: "center",
    },
});
