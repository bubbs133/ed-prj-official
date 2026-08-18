import React, { useMemo, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";

import BottomSheet from "@gorhom/bottom-sheet";

import Colors from "../constants/colors";

async function openLink(url) {
  if (!url) return;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unavailable", "This action isn't supported on your device.");
    }
  } catch (error) {
    console.log("Linking error:", error);
    Alert.alert("Unavailable", "Couldn't open this link.");
  }
}

function PlaceDetailSheet({ place, distance, onClose }) {
  const sheetRef = useRef();

  const snapPoints = useMemo(() => ["45%"], []);

  useEffect(() => {
    if (place) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [place]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={styles.content}>
        {place && (
          <>
            <Text style={styles.title}>
              {place.tags?.name || "Healthcare Facility"}
            </Text>

            <Text style={styles.subtitle}>
              {place.tags?.healthcare || place.tags?.office || "Healthcare"}
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Address</Text>

              <Text style={styles.value}>
                {place.tags?.["addr:housenumber"]} {place.tags?.["addr:street"]}
                {"\n"}
                {place.tags?.["addr:city"]}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Phone</Text>

              <Text style={styles.value}>
                {place.tags?.phone || "Unavailable"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Distance</Text>

              <Text style={styles.value}>
                {distance != null ? distance.toFixed(1) : "?"} km away
              </Text>
            </View>

            <View style={styles.buttons}>
              <Pressable
                style={styles.callButton}
                onPress={() =>
                  place.tags?.phone
                    ? openLink(`tel:${place.tags.phone}`)
                    : Alert.alert("Unavailable", "No phone number listed.")
                }
              >
                <Text style={styles.buttonText}>Call</Text>
              </Pressable>

              <Pressable
                style={styles.directionButton}
                onPress={() =>
                  openLink(
                    `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`,
                  )
                }
              >
                <Text style={styles.buttonText}>Directions</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

export default PlaceDetailSheet;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 25,
  },

  icon: {
    fontSize: 36,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.darkNeutral,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    color: "#888",
  },

  infoSection: {
    marginBottom: 18,
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 16,
  },

  value: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  callButton: {
    backgroundColor: "#78C4D4",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
  },

  directionButton: {
    backgroundColor: "#F6C667",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
