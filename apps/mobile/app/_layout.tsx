import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F5F1EA",
        tabBarInactiveTintColor: "rgba(245,241,234,0.45)",
        tabBarStyle: {
          backgroundColor: "#050505",
          borderTopColor: "rgba(255,255,255,0.1)"
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="plans" options={{ title: "Plans" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
