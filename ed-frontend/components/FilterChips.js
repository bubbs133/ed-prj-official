import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import Colors from "../constants/colors";

const FILTERS = ["All", "Therapists", "Hospitals", "Psychiatrists", "Clinics"];

function FilterChips() {
  const [selected, setSelected] = useState("All");

  return (
    <View style={styles.container}>
      {FILTERS.map((item) => (
        <Pressable
          key={item}
          style={[styles.chip, selected === item && styles.selectedChip]}
          onPress={() => setSelected(item)}
        >
          <Text style={[styles.text, selected === item && styles.selectedText]}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default FilterChips;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  chip: {
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedChip: {
    backgroundColor: Colors.primaryBlue,
  },

  text: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
    fontSize: 15,
  },

  selectedText: {
    color: "white",
    fontWeight: "700",
  },
});
