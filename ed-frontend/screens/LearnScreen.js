import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";
import SectionHeading from "../components/SectionHeading";
import { LESSONS } from "../models/foodStudio";

export default function LearnScreen() {
  const [openId, setOpenId] = useState(null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
      <SectionHeading
        eyebrow="Food Lessons"
        title="Learn"
        sub="Tiny, judgment-free lessons about nourishment."
      />
      <View style={{ gap: 10 }}>
        {LESSONS.map((l) => {
          const open = openId === l.id;
          return (
            <Pressable
              key={l.id}
              style={styles.card}
              onPress={() => setOpenId(open ? null : l.id)}
            >
              <View style={styles.header}>
                <Text style={{ fontSize: 24 }}>{l.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{l.title}</Text>
                  {!open && <Text style={styles.teaser}>{l.teaser}</Text>}
                </View>
                <Text style={styles.toggle}>{open ? "–" : "+"}</Text>
              </View>
              {open && <Text style={styles.body}>{l.body}</Text>}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 18,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 16, color: colors.ink },
  teaser: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  toggle: { fontSize: 18, color: colors.inkSoft },
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.ink,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
