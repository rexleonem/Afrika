import { ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#050505" }} contentContainerStyle={{ padding: 20, paddingTop: 72 }}>
      <Text style={{ color: "#F5F1EA", fontSize: 32, fontWeight: "600" }}>Profile.</Text>
      <Text style={{ color: "rgba(245,241,234,0.7)", marginTop: 10, fontSize: 15, lineHeight: 22 }}>
        Saved discoveries, preferences, and recent activity.
      </Text>

      <View
        style={{
          marginTop: 24,
          borderRadius: 24,
          backgroundColor: "#12141A",
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)"
        }}
      >
        <Text style={{ color: "#F5F1EA", fontSize: 18, fontWeight: "600" }}>Personalization</Text>
        <Text style={{ color: "rgba(245,241,234,0.7)", marginTop: 10, fontSize: 14, lineHeight: 20 }}>
          Optimized for your preferred cities, interests, and discovery patterns.
        </Text>
      </View>
    </ScrollView>
  );
}
