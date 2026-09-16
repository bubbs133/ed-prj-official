import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
  Animated,
  Modal,
} from "react-native";

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

function PlaceDetailSheet({ place, distance, driveMinutes, onClose }) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (place) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [place]);

  if (!place) return null;

  const tags = place.tags || {};

  const formattedDrive =
    driveMinutes != null ? `${Math.round(driveMinutes)} min drive` : null;

  const formattedDistance =
    distance != null ? `${distance.toFixed(1)} km away` : null;

  // Build a short "quick facts" list from whatever tags Overpass gave us
  const quickFacts = [];
  if (tags.opening_hours)
    quickFacts.push({ label: "Hours", value: tags.opening_hours });
  if (tags.wheelchair)
    quickFacts.push({
      label: "Wheelchair access",
      value:
        tags.wheelchair === "yes"
          ? "Accessible"
          : tags.wheelchair === "no"
            ? "Not accessible"
            : "Limited",
    });
  if (tags.emergency === "yes")
    quickFacts.push({ label: "Emergency care", value: "Available" });
  if (tags["healthcare:speciality"])
    quickFacts.push({
      label: "Specialty",
      value: tags["healthcare:speciality"],
    });

  return (
    <Modal
      transparent
      visible={!!place}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />

        <Text style={[styles.title, styles.globalFont]}>
          {tags.name || "Healthcare Facility"}
        </Text>
        <Text style={[styles.subtitle, styles.globalFont]}>
          {tags.healthcare || tags.office || "Healthcare"}
        </Text>

        <View style={[styles.infoSection, styles.globalFont]}>
          <Text style={[styles.label, styles.globalFont]}>Address</Text>
          <Text style={[styles.value, styles.globalFont]}>
            {[tags["addr:housenumber"], tags["addr:street"]]
              .filter(Boolean)
              .join(" ") || "Not listed"}
            {tags["addr:city"] ? `\n${tags["addr:city"]}` : ""}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.label, styles.globalFont]}>Phone</Text>
          <Text style={[styles.value, styles.globalFont]}>
            {tags.phone || "Unavailable"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.label, styles.globalFont]}>Distance</Text>
          <Text style={[styles.value, styles.globalFont]}>
            {formattedDistance || "?"}
            {formattedDrive ? ` · ${formattedDrive}` : ""}
          </Text>
        </View>

        {quickFacts.map((fact) => (
          <View style={styles.infoSection} key={fact.label}>
            <Text style={[styles.label, styles.globalFont]}>{fact.label}</Text>
            <Text style={[styles.value, styles.globalFont]}>{fact.value}</Text>
          </View>
        ))}

        <View style={styles.buttons}>
          <Pressable
            style={styles.callButton}
            onPress={() =>
              tags.phone
                ? openLink(`tel:${tags.phone}`)
                : Alert.alert("Unavailable", "No phone number listed.")
            }
          >
            <Text style={[styles.buttonText, styles.globalFont]}>Call</Text>
          </Pressable>

          <Pressable
            style={styles.directionButton}
            onPress={() =>
              openLink(
                `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`,
              )
            }
          >
            <Text style={[styles.buttonText, styles.globalFont]}>Directions</Text>
          </Pressable>
        </View>

        {tags.website && (
          <Pressable
            onPress={() => openLink(tags.website)}
            style={styles.websiteLink}
          >
            <Text style={[styles.websiteText, styles.globalFont]}>Visit website</Text>
          </Pressable>
        )}

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeButtonText, styles.globalFont]}>Close</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

export default PlaceDetailSheet;

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: "70%",
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.darkNeutral,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#888",
    textTransform: "capitalize",
  },

  infoSection: {
    marginBottom: 16,
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
    marginTop: 10,
  },

  callButton: {
    backgroundColor: Colors.homeBlue,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
  },

  directionButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    borderColor: Colors.homeBlue,
    borderWidth: 2
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  websiteLink: {
    marginTop: 14,
    alignSelf: "center",
  },

  websiteText: {
    color: Colors.primaryBlue || "#4A90D9",
    fontWeight: "600",
    fontSize: 15,
  },

  closeButton: {
    marginTop: 16,
    alignSelf: "center",
  },

  closeButtonText: {
    color: "#999",
    fontSize: 14,
  },
});
