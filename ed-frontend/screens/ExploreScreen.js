import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";
import SectionHeading from "../components/SectionHeading";
import { EXPLORER_PROMPTS } from "../models/foodStudio";
//import { logExplorerAttempt } from "../api/foodStudioApi";

// Pick a stable prompt for "today" — swap this for a real date-seeded or
// backend-driven choice so every user sees the same prompt on a given day.
function todaysPrompt() {
  const dayIndex = new Date().getDate() % EXPLORER_PROMPTS.length;
  return EXPLORER_PROMPTS[dayIndex];
}

export default function ExploreScreen() {
  const [prompt] = useState(todaysPrompt);
  const [tried, setTried] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await logExplorerAttempt({ promptId: prompt.id, note });
    } catch (e) {
      // Non-blocking — still confirm to the user even if the network call fails;
      // consider a local retry queue for production.
    } finally {
      setSaving(false);
      setSaved(true);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        <SectionHeading
          eyebrow="Today's Food Explorer"
          title="Try a new topping"
          sub="No need to finish it. No rating. Just notice what you think."
        />

        <View style={styles.card}>
          <Text style={{ fontSize: 36, textAlign: "center" }}>
            {prompt.emoji}
          </Text>
          <Text style={styles.promptText}>{prompt.text}</Text>
          <Text style={styles.promptWhy}>
            A small way to notice {prompt.why}.
          </Text>

          {!tried ? (
            <Pressable style={styles.tryBtn} onPress={() => setTried(true)}>
              <Text style={styles.tryBtnText}>I tried it! 🎉</Text>
            </Pressable>
          ) : saved ? (
            <Text style={styles.savedText}>
              Noted — thanks for trying something new today 🌸
            </Text>
          ) : (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.noteLabel}>
                What did you notice? (optional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Surprisingly good, kind of weird, would try again..."
                placeholderTextColor={colors.inkSoft}
                multiline
                style={styles.input}
              />
              <Pressable
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? "Saving..." : "Save to journal"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.lavender,
    borderRadius: radii.lg,
    padding: 24,
    alignItems: "center",
  },
  promptText: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.ink,
    marginTop: 8,
    textAlign: "center",
  },
  promptWhy: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 4,
    textAlign: "center",
  },
  tryBtn: {
    marginTop: 18,
    backgroundColor: colors.sage,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tryBtnText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white },
  savedText: {
    marginTop: 18,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.sageDeep,
    textAlign: "center",
  },
  noteLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.inkSoft,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    minHeight: 70,
    color: colors.ink,
    backgroundColor: colors.card,
    textAlignVertical: "top",
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: colors.apricot,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.white,
  },
});
