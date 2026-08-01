import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";

import PlaceCard from "./PlaceCard";
import Colors from "../constants/colors";

function PlaceList({ places, location, getDistance, onSelect }) {
  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={[styles.globalFont, styles.header]}>Nearby Professionals</Text>
      }
      renderItem={({ item }) => (
        <PlaceCard
          place={item}
          distance={getDistance(
            location.latitude,
            location.longitude,
            item.lat,
            item.lon,
          )}
          onPress={() => onSelect(item)}
        />
      )}
    />
  );
}

export default PlaceList;

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 22,
    marginBottom: 16,
    fontSize: 23,
    fontWeight: "700",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral
  }
});
