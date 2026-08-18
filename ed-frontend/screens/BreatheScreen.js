// screens/BreatheScreen.js
//
// A simple animated circle standing in for the web version's organic
// "blob". React Native's borderRadius doesn't support the CSS
// multi-corner shorthand used there, so this scales a soft gradient
// circle instead. If you want the same morphing-blob look, add
// react-native-svg and animate a <Path> — happy to build that version
// if it matters to you.

import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

const SEQUENCE = [
  { key: "inhale", label: "Breathe in", secs: 4, to: 1.15 },
  { key: "hold", label: "Hold", secs: 7, to: 1.15 },
  { key: "exhale", label: "Breathe out", secs: 8, to: 0.85 },
];
const CYCLES = 4;

export default function BreatheScreen({ onClose }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const [phaseLabel, setPhaseLabel] = useState("Get comfortable");
  const [phaseSecs, setPhaseSecs] = useState(null);
  const timeouts = useRef([]);

  const clearTimers = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  useEffect(() => {
    let elapsed = 0;
    for (let cycle = 0; cycle < CYCLES; cycle++) {
      SEQUENCE.forEach((step) => {
        const delayMs = elapsed * 1000;
        timeouts.current.push(
          setTimeout(() => {
            setPhaseLabel(step.label);
            setPhaseSecs(step.secs);
            Animated.timing(scale, {
              toValue: step.to,
              duration: step.secs * 1000,
              useNativeDriver: true,
            }).start();
          }, delayMs),
        );
        elapsed += step.secs;
      });
    }
    timeouts.current.push(
      setTimeout(() => {
        setPhaseLabel("Nicely done");
        setPhaseSecs(null);
      }, elapsed * 1000),
    );

    return clearTimers;
  }, [clearTimers, scale]);

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity
          label="×"
          onPress={() => {
            clearTimers();
            onClose();
          }}
          accessibilityLabel="Close"
        />
        <Text style={styles.h2}>Breathe with me</Text>
      </View>

      <View style={styles.blobWrap}>
        <Animated.View style={[styles.blobOuter, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={["#ABC4AE", Colors.homeBlue]}
            start={{ x: 0.3, y: 0.2 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.blobGradient}
          />
        </Animated.View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.phaseName}>{phaseLabel}</Text>
        <Text style={styles.phaseTimer}>
          {phaseSecs ? `${phaseSecs}s` : "Stay here as long as you like"}
        </Text>
      </View>

      <Text style={styles.footer}>
        Follow the shape. It will guide you in, hold, and out — no counting
        required.
      </Text>
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
  h2: { fontFamily: "Afacad", fontSize: 18, color: Colors.darkNeutral },
  blobWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  blobOuter: { width: 150, height: 150, borderRadius: 75, overflow: "hidden" },
  blobGradient: { flex: 1 },
  copy: { alignItems: "center", paddingHorizontal: 30 },
  phaseName: {
    fontFamily: "Afacad",
    fontSize: 19,
    color: Colors.homeBlue,
    marginBottom: 4,
  },
  phaseTimer: { fontFamily: "Afacad", fontSize: 13, color: Colors.homeBlue },
  footer: {
    fontFamily: "Afacad",
    fontSize: 12.5,
    color: Colors.homeBlue,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
  },
});
