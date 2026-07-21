import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/colors";

function getDayLabel(dateString) {
  const activityDate = new Date(dateString);

  const today = new Date();

  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const activityDay = activityDate.toDateString();

  if (activityDay === today.toDateString()) {
    return "Today";
  }

  if (activityDay === yesterday.toDateString()) {
    return "Yesterday";
  }

  return activityDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function getIcon(type) {
  switch (type) {
    case "journal":
      return {
        name: "book-outline",
        emoji: "📖",
      };

    case "carelog":
      return {
        name: "heart-outline",
        emoji: "💙",
      };

    case "quest":
      return {
        name: "footsteps-outline",
        emoji: "🏖️",
      };

    default:
      return {
        name: "ellipse-outline",
        emoji: "🌊",
      };
  }
}

function groupActivity(activity) {
  const groups = {};

  activity.forEach((item) => {
    const label = getDayLabel(item.date);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(item);
  });

  return groups;
}

export default function ActivityTimeline({ activity = [], onSelectActivity }) {
  const grouped = groupActivity(activity);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recovery Journey</Text>

      {Object.keys(grouped).map((section) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section}</Text>

          {grouped[section].map((item) => {
            const icon = getIcon(item.type);

            return (
              <Pressable
                key={`${item.type}-${item.id}`}
                onPress={() => onSelectActivity(item)}
                style={({ pressed }) => [
                  styles.activityCard,

                  pressed && styles.pressed,
                ]}
              >
                {/**<View style={styles.iconContainer}>
                  <Text style={styles.emoji}>{icon.emoji}</Text>
                </View>**/}

                <View style={styles.textContainer}>
                  <Text style={styles.activityTitle}>{item.title}</Text>

                  <Text numberOfLines={2} style={styles.preview}>
                    {item.preview}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={Colors.seaDarkBlue}
                />
              </Pressable>
            );
          })}
        </View>
      ))}

      {activity.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🌱 Start your journey today!</Text>

          <Text style={styles.emptySubtext}>
            Your journals, care logs, and quests will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  title: {
    fontSize: 20,

    fontWeight: "600",

    color: Colors.darkNeutral,

    marginBottom: 15,

    fontFamily: "Afacad",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 15,

    fontWeight: "600",

    marginBottom: 8,

    color: Colors.darkNeutral,

    fontFamily: "Afacad",
  },

  activityCard: {
    backgroundColor: "#F5F5F5",

    borderRadius: 18,

    padding: 14,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 10,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 5,

    elevation: 2,
  },

  pressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 45,

    height: 45,

    borderRadius: 25,

    backgroundColor: "#E6F3F5",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 12,
  },

  emoji: {
    fontSize: 22,
  },

  textContainer: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,

    fontWeight: "600",

    color: Colors.darkNeutral,

    fontFamily: "Afacad",
  },

  preview: {
    marginTop: 3,

    fontSize: 14,

    color: "#666",

    fontFamily: "Afacad",
  },

  emptyContainer: {
    alignItems: "center",

    padding: 20,
  },

  emptyText: {
    fontSize: 17,

    fontFamily: "Afacad",
  },

  emptySubtext: {
    marginTop: 5,

    color: "#777",

    textAlign: "center",

    fontFamily: "Afacad",
  },
});
