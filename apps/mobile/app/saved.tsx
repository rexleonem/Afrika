import { ScrollView, Text, View } from "react-native";
import { samplePlans } from "@afrika/shared/content";

export default function SavedScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#050505" }} contentContainerStyle={{ padding: 20, paddingTop: 72 }}>
      <Text style={{ color: "#F5F1EA", fontSize: 32, fontWeight: "600" }}>Saved.</Text>
      <Text style={{ color: "rgba(245,241,234,0.7)", marginTop: 10, fontSize: 15, lineHeight: 22 }}>
        Your saved discoveries and lightweight plans.
      </Text>

      <View style={{ marginTop: 24, gap: 14 }}>
        {samplePlans.map((plan) => (
          <View
            key={plan.id}
            style={{
              borderRadius: 24,
              backgroundColor: "#12141A",
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)"
            }}
          >
            <Text style={{ color: "#F5F1EA", fontSize: 20, fontWeight: "600" }}>{plan.title}</Text>
            <Text style={{ color: "rgba(245,241,234,0.55)", marginTop: 4, fontSize: 12, textTransform: "uppercase" }}>
              {plan.type}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
