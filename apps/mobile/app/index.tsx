import { ScrollView, Text, View, Image, Pressable } from "react-native";
import { featuredCards } from "@afrika/shared/content";

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#050505" }} contentContainerStyle={{ padding: 20, paddingTop: 72 }}>
      <Text style={{ color: "#D9D6CF", letterSpacing: 6, textTransform: "uppercase", fontSize: 10 }}>AFRIKA</Text>
      <Text style={{ color: "#F5F1EA", fontSize: 38, lineHeight: 42, marginTop: 14, fontWeight: "600" }}>
        Discover the living intelligence of African places.
      </Text>
      <Text style={{ color: "rgba(245,241,234,0.7)", fontSize: 15, lineHeight: 22, marginTop: 12 }}>
        Visual, useful, and calm discovery built around real-world action.
      </Text>

      {featuredCards.map((card) => (
        <View
          key={card.id}
          style={{
            marginTop: 22,
            borderRadius: 28,
            overflow: "hidden",
            backgroundColor: "#12141A",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)"
          }}
        >
          <Image source={{ uri: card.media.imageUrl }} style={{ width: "100%", height: 420 }} />
          <View style={{ padding: 18, gap: 10 }}>
            <Text style={{ color: "rgba(245,241,234,0.55)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
              {card.category} · {card.location}
            </Text>
            <Text style={{ color: "#F5F1EA", fontSize: 24, fontWeight: "600" }}>{card.title}</Text>
            <Text style={{ color: "rgba(245,241,234,0.72)", fontSize: 15, lineHeight: 22 }}>{card.intelligence.summary}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["Save", "Explore", "Open Map"].map((action) => (
                <Pressable
                  key={action}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)"
                  }}
                >
                  <Text style={{ color: "#F5F1EA", fontSize: 12 }}>{action}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
