import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";
import SectionHeading from "../components/SectionHeading.js";
import Chip from "../components/Chip.js";
import RecipeCard from "../components/ReadsList.js";
import { RECIPES, DECIDE_MOODS } from "../models/foodStudio.js";

export default function DecideScreen() {
  const [mood, setMood] = useState(null);
  const [effort, setEffort] = useState(null);

  const suggestions = useMemo(() => {
    if (!mood) return [];
    const pool =
      mood === "unsure"
        ? RECIPES
        : RECIPES.filter((r) => r.moods.includes(mood));
    const base = pool.length ? pool : RECIPES;
    const filtered =
      effort === "quick"
        ? base.filter(
            (r) => r.moods.includes("quick") || r.moods.includes("no-cook"),
          )
        : base;
    const list = filtered.length ? filtered : base;
    return list.slice(0, 3);
  }, [mood, effort]);

  const reset = () => {
    setMood(null);
    setEffort(null);
  };

  const showResults = mood && (mood === "unsure" ? effort !== null : true);

  if (showResults) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
        <SectionHeading
          eyebrow="A few ideas"
          title="Here's what might sound good"
        />
        <View style={{ gap: 10 }}>
          {suggestions.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </View>
        <Pressable style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetBtnText}>Start over</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (mood === "unsure" && effort === null) {
    return (
      <View style={{ padding: 20 }}>
        <SectionHeading
          eyebrow="One quick question"
          title="How much energy do you have for this?"
        />
        <View style={styles.chipRow}>
          <Chip
            emoji="⚡"
            label="Barely any — keep it simple"
            onPress={() => setEffort("quick")}
          />
          <Chip
            emoji="🍳"
            label="A little — I can cook something"
            onPress={() => setEffort("normal")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <SectionHeading
        eyebrow="No pressure, just curiosity"
        title="What sounds good right now?"
      />
      <View style={styles.chipRow}>
        {DECIDE_MOODS.map((m) => (
          <Chip
            key={m.id}
            emoji={m.emoji}
            label={m.label}
            onPress={() => setMood(m.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  resetBtn: {
    marginTop: 16,
    borderRadius: radii.md,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.sage,
  },
  resetBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.sageDeep,
  },
});
