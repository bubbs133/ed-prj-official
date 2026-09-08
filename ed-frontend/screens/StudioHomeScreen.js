import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";
import GoBack from "../components/GoBack";
//import { getFoodStudioNudge } from "../api/foodStudioApi";

const HOME_CARDS = [
  {
    id: "Decide",
    title: "I Don't Know What to Eat",
    sub: "Answer one question, get 3 gentle ideas.",
    tint: colors.blush,
  },
  {
    id: "Explore",
    title: "Explore",
    sub: "A tiny food experiment, no pressure.",
    tint: colors.lavender,
  },
  {
    id: "Recipes",
    title: "Recipes",
    sub: "Simple meals, sorted by what sounds good.",
    tint: colors.butter,
  },
];

export default function StudioHomeScreen({ navigation }) {
  const [nudge, setNudge] = useState(null);

  /*useEffect(() => {
    // Best-effort — a failed or empty nudge should never block the screen.
    getFoodStudioNudge()
      .then((data) => {
        if (data && data.type !== "none") setNudge(data);
      })
      .catch(() => {});
  }, []);*/

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <View style={styles.hero}>
        <GoBack navigation={navigation} />
        <Text style={styles.heroTitle}>Food Studio</Text>
        <Text style={styles.heroSub}>
          A space to get curious about food again — no calories, no rules, no
          rating.
        </Text>
      </View>

      {nudge && (
        <Pressable
          style={styles.nudge}
          onPress={() =>
            navigation.navigate("Recipes", { moodFilter: nudge.recipe_mood })
          }
        >
          <Text style={styles.nudgeText}>{nudge.message}</Text>
          <Text style={styles.nudgeCta}>{nudge.cta} →</Text>
        </Pressable>
      )}

      <View style={styles.grid}>
        {HOME_CARDS.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.card, { backgroundColor: c.tint }]}
            onPress={() => navigation.navigate(c.id)}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</Text>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <Text style={styles.cardSub}>{c.sub}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingLeft: "5%",
    paddingRight: "5%",
    marginTop: 30,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  heroTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.ink,
    marginTop: 4,
  },
  heroSub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    color: colors.inkSoft,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 20
  },
  nudge: {
    backgroundColor: colors.sage,
    borderRadius: radii.md,
    padding: 16,
    marginBottom: 18,
  },
  nudgeText: { fontFamily: fonts.body, fontSize: 14, color: colors.white },
  nudgeCta: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.white,
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 4,
  },
  cardTitle: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  cardSub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 3,
    lineHeight: 16,
  },
});
