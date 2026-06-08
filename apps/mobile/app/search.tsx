import { ScrollView, Text, View } from "react-native";

const suggestions = [
  "quiet places to work in Lagos",
  "weekend escapes under 2 hours",
  "areas in Lagos growing fast"
];

export default function SearchScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#050505" }} contentContainerStyle={{ padding: 20, paddingTop: 72 }}>
      <Text style={{ color: "#F5F1EA", fontSize: 32, fontWeight: "600" }}>Search with intent.</Text>
      <Text style={{ color: "rgba(245,241,234,0.7)", marginTop: 10, fontSize: 15, lineHeight: 22 }}>
        Ask AFRIKA for places, patterns, and nearby intelligence.
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {suggestions.map((item) => (
          <View
            key={item}
            style={{
              borderRadius: 20,
              padding: 16,
              backgroundColor: "#12141A",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)"
            }}
          >
            <Text style={{ color: "#F5F1EA", fontSize: 16 }}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
