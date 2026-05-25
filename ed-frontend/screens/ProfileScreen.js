import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const user = {
    name: "Valeria",
    memberSince: "May 2026",
    streak: 5,
    journals: 12,
    checkIns: 18,
  };

  function settingsHandler() {
    console.log("settings");
    navigation.navigate("Settings");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.bars}>
            <Pressable onPress={settingsHandler}>
              <Ionicons name="reorder-three-outline" size={34} />
            </Pressable>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.subtext}>Member since {user.memberSince}</Text>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Activity</Text>

          <Text>🔥 Streak: {user.streak} days</Text>
          <Text>📓 Journals: {user.journals}</Text>
          <Text>💬 Check-ins: {user.checkIns}</Text>
        </View>

        {/* Rewards */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <Text>🎁 Stickers coming soon</Text>
          <Text>🏆 Badges coming soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },

  name: {
    fontSize: 22,
    fontWeight: "600",
  },

  subtext: {
    color: "gray",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
});
