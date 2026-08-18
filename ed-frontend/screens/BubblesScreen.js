// screens/BubblesScreen.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";

const BUBBLE_COLORS = [Colors.homeBlue, Colors.seaBlue, "#9CB4C9", "#C9B79C"];
let nextId = 0;

export default function BubblesScreen({ onClose }) {
  const [bubbles, setBubbles] = useState([]);
  const fieldHeight = useRef(0);
  const intervalRef = useRef(null);

  const spawnBubble = useCallback(() => {
    const id = nextId++;
    const size = 26 + Math.random() * 40;
    const left = Math.random() * 0.8; // fraction of field width
    const color =
      BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    const duration = 5000 + Math.random() * 3000;
    const translateY = new Animated.Value(0);
    const scale = new Animated.Value(1);
    const opacity = new Animated.Value(1);

    setBubbles((prev) => [
      ...prev,
      { id, size, left, color, translateY, scale, opacity },
    ]);

    const travel = (fieldHeight.current || 600) + 100;
    Animated.timing(translateY, {
      toValue: -travel,
      duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) removeBubble(id);
    });
  }, []);

  const removeBubble = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  const popBubble = (bubble) => {
    Animated.parallel([
      Animated.timing(bubble.scale, {
        toValue: 1.7,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(bubble.opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => removeBubble(bubble.id));
  };

  useEffect(() => {
    intervalRef.current = setInterval(spawnBubble, 650);
    return () => clearInterval(intervalRef.current);
  }, [spawnBubble]);

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity
          label="×"
          onPress={onClose}
          accessibilityLabel="Close"
        />
        <Text style={styles.h2}>Let your hands do something</Text>
      </View>

      <View
        style={styles.field}
        onLayout={(e) => {
          fieldHeight.current = e.nativeEvent.layout.height;
        }}
      >
        {bubbles.map((b) => (
          <Pressable
            key={b.id}
            onPress={() => popBubble(b)}
            style={{
              left: `${b.left * 100}%`,
              position: "absolute",
              bottom: -60,
            }}
          >
            <Animated.View
              style={[
                styles.bubble,
                {
                  width: b.size,
                  height: b.size,
                  borderRadius: b.size / 2,
                  backgroundColor: b.color,
                  transform: [{ translateY: b.translateY }, { scale: b.scale }],
                  opacity: b.opacity,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.hint}>
        Tap the bubbles as they drift by. That's the whole thing.
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
  field: {
    flex: 1,
    margin: 12,
    borderRadius: 20,
    backgroundColor: "#EEF1F4",
    borderWidth: 1,
    borderColor: Colors.homeBlue,
    overflow: "hidden",
  },
  bubble: {
    shadowColor: Colors.darkNeutral,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  hint: {
    fontFamily: "Afacad",
    fontSize: 12.5,
    color: Colors.homeBlue,
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
