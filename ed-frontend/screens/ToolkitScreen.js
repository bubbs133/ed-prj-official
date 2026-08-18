// screens/ToolkitScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";
import ToolCard from "../components/ToolCard";

export default function ToolkitScreen({
  onBack,
  onSelectBreathe,
  onSelectBubbles,
  onSelectRelease,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity label="←" onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.h2}>Let's ride this out</Text>
      </View>

      <Text style={styles.lede}>
        You don't have to fix this feeling right now. Just pick one small thing
        to do for the next minute or two.
      </Text>

      <ScrollView contentContainerStyle={styles.cardList}>
        <ToolCard
          emoji="🌬️"
          glyphBg="#E4EDE4"
          title="Breathe with me"
          subtitle="A 90-second guided breath to slow things down"
          onPress={onSelectBreathe}
        />
        <ToolCard
          emoji="🫧"
          glyphBg="#E5EAF1"
          title="Let your hands do something"
          subtitle="A quiet, mindless little distraction"
          onPress={onSelectBubbles}
        />
        <ToolCard
          emoji="🍃"
          glyphBg="#F1E6E4"
          title="Get it out, then let it go"
          subtitle="Write down the thought, then release it"
          onPress={onSelectRelease}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  h2: { fontFamily: "Afacad", fontSize: 18, color: Colors.homeBlue },
  lede: {
    fontFamily: "Afacad",
    fontSize: 14.5,
    color: Colors.homeBlue,
    lineHeight: 21,
    paddingHorizontal: 24,
    marginTop: 14,
  },
  cardList: { padding: 20, gap: 12 },
});
