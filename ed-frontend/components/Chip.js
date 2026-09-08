import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";

export default function Chip({ emoji, label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && !selected && styles.chipPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipPressed: {
    borderColor: colors.sage,
  },
  chipSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sageDeep,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  labelSelected: {
    color: colors.white,
  },
});
