import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import Colors from "../constants/colors";

function PlaceCard({ place, distance, onPress }) {
  const healthcareType =
    place.tags?.healthcare || place.tags?.office || "Healthcare";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.middle}>
        <Text style={styles.title}>
          {place.tags?.name || "Healthcare Facility"}
        </Text>

        <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

export default PlaceCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 22,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.greyish,
  },
  middle: {
    flex: 1,
  },

  title: {
    fontFamily: "Afacad",
    fontWeight: "500",
    fontSize: 19,
    color: Colors.darkNeutral,
  },

  type: {
    marginTop: 4,
    fontSize: 15,
    color: "#888",
    textTransform: "capitalize",
  },

  distance: {
    marginTop: 7,
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
    fontSize: 15,
  },

  right: {
    justifyContent: "center",
  },

  arrow: {
    fontSize: 32,
    color: "#C9CED6",
  },
});
