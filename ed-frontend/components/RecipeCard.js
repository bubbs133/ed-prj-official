import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";

export default function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setOpen(!open)}>
        <Text style={styles.emoji}>{recipe.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{recipe.name}</Text>
          <Text style={styles.note}>{recipe.note}</Text>
        </View>
        <Text style={styles.toggle}>{open ? "–" : "+"}</Text>
      </Pressable>

      {open && (
        <View style={styles.body}>
          <Text style={styles.label}>You'll want</Text>
          <Text style={styles.text}>{recipe.ingredients.join(" · ")}</Text>
          <Text style={[styles.label, { marginTop: 10 }]}>How</Text>
          {recipe.steps.map((step, i) => (
            <Text key={i} style={styles.step}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 16,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  emoji: { fontSize: 24 },
  name: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  note: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 2,
  },
  toggle: { fontSize: 16, color: colors.inkSoft },
  body: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.sageDeep,
    marginBottom: 4,
  },
  text: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: colors.ink },
  step: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13.5,
    color: colors.ink,
    lineHeight: 20,
    marginTop: 2,
  },
});
