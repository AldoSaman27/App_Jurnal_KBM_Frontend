import { Tabs } from "expo-router";

// Icon
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2099FF" }}>
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
