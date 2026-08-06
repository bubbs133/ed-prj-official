import React from "react";

import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/colors";

export default function ActivityModal({ visible, activity, onClose }) {
  if (!activity) {
    return null;
  }

  function renderContent() {
    // ==========================
    // JOURNAL
    // ==========================

    if (activity.type === "journal") {
      return (
        <>
          <Text style={styles.label}>Reflection</Text>

          <Text style={styles.bodyText}>{activity.content}</Text>
        </>
      );
    }

    // ==========================
    // CARE LOG
    // ==========================

    if (activity.type === "carelog") {
      const details = activity.details || {};

      return (
        <View>
          <Metric label="Urge Intensity" value={details.urge_intensity} />

          <Metric label="Binge Urge" value={details.binge_urge} />

          <Metric label="Restriction" value={details.restriction} />

          <Metric
            label="Emotional Distress"
            value={details.emotional_distress}
          />

          <Metric label="Stress" value={details.stress_level} />

          <Metric label="Energy" value={details.energy_level} />

          <Metric label="Sleep" value={`${details.sleep_hours} hrs`} />

          <Metric label="Meals" value={details.num_meals} />

          <Metric label="Exercise" value={`${details.exercise_minutes} min`} />

          {details.notes ? (
            <>
              <Text style={styles.label}>Notes</Text>

              <Text style={styles.bodyText}>{details.notes}</Text>
            </>
          ) : null}
        </View>
      );
    }

    // ==========================
    // QUEST
    // ==========================

    if (activity.type === "quest") {
      return (
        <>
          <Text style={styles.label}>Quest Completed</Text>

          <Text style={styles.bodyText}>
            {activity.details?.quest_summary || activity.preview}
          </Text>
        </>
      );
    }

    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{activity.title}</Text>

              <Text style={styles.date}>
                {new Date(activity.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            <Pressable onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={32}
                color={Colors.seaDarkBlue}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {renderContent()}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>

      <Text style={styles.metricValue}>{value ?? "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.35)",

    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    padding: 22,

    maxHeight: "80%",
  },

  handle: {
    width: 45,

    height: 5,

    backgroundColor: "#DDD",

    borderRadius: 10,

    alignSelf: "center",

    marginBottom: 20,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 20,
  },

  title: {
    fontSize: 22,

    fontWeight: "600",

    color: Colors.darkNeutral,

    fontFamily: "Afacad",
  },

  date: {
    marginTop: 4,

    color: "#777",

    fontFamily: "Afacad",
  },

  content: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,

    fontWeight: "600",

    marginBottom: 8,

    color: Colors.seaDarkBlue,

    fontFamily: "Afacad",
  },

  bodyText: {
    fontSize: 16,

    lineHeight: 24,

    color: Colors.darkNeutral,

    fontFamily: "Afacad",

    marginBottom: 18,
  },

  metricRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor: "#EEE",
  },

  metricLabel: {
    fontSize: 15,

    color: "#555",

    fontFamily: "Afacad",
  },

  metricValue: {
    fontSize: 15,

    fontWeight: "600",

    color: Colors.seaDarkBlue,

    fontFamily: "Afacad",
  },
});
