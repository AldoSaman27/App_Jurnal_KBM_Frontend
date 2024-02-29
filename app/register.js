import { Link } from "expo-router";
import { View, Text } from "react-native";

const register = () => {
  return (
    <View>
      <Text>register</Text>
      <Link href="/">Index</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">register</Link>
    </View>
  );
};

export default register;
