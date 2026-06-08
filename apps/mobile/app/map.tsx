import { ScrollView, Text, View } from "react-native";

export default function MapScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#050505" }} contentContainerStyle={{ padding: 20, paddingTop: 72 }}>
      <Text style={{ color: "#F5F1EA", fontSize: 32, fontWeight: "600" }}>Map mode.</Text>
      <Text style={{ color: "rgba(245,241,234,0.7)", marginTop: 10, fontSize: 15, lineHeight: 22 }}>
        Clustered discovery, nearby intelligence, and trending zones.
      </Text>

      <View
        style={{
          marginTop: 24,
          borderRadius: 28,
          minHeight: 420,
          backgroundColor: "#12141A",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#D9D6CF", letterSpacing: 4, textTransform: "uppercase", fontSize: 11 }}>Map preview</Text>
      </View>
    </ScrollView>
  );
}
