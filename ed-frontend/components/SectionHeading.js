import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function SectionHeading({ eyebrow, title, sub }) {
  return (
    <View style={styles.wrap}>
      {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.title}>{title}</Text>
      {!!sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 22 },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.apricot,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 24,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    color: colors.inkSoft,
    marginTop: 4,
  },
});
