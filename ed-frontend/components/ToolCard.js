// components/ToolCard.js
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

export default function ToolCard({ emoji, glyphBg, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.glyph, { backgroundColor: glyphBg }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.homeBlue,
    borderWidth: 1,
    borderColor: Colors.homeBlue,
    borderRadius: 10,
    padding: 16,
  },
  pressed: {
    borderColor: Colors.homeBlue,
  },
  glyph: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 19 },
  textCol: { flex: 1 },
  title: {
    fontFamily: "Afacad",
    fontSize: 15.5,
    color: Colors.homeBlue,
    marginBottom: 3,
  },
  subtitle: {
    fontFamily: "Afacad",
    fontSize: 12.5,
    color: Colors.homeBlue,
    lineHeight: 17,
  },
});
