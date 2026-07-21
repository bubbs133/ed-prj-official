import React, { useState, useEffect, useContext } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../auth/auth-context";

import Colors from "../constants/colors";

import ActivityTimeline from "../components/ActivityTimeline";

import ActivityModal from "../components/ActivityModal";

export default function ProfileScreen({ navigation }) {
  const authCtx = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!authCtx.token) {
        setLoading(false);

        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/user-summary/", {
          headers: {
            Authorization: `Token ${authCtx.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load profile data.");
        }

        const data = await response.json();

        setProfileData(data);
      } catch (err) {
        setError(err.message || "Unable to fetch profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [authCtx.token]);

  function openActivity(activity) {
    setSelectedActivity(activity);

    setModalVisible(true);
  }

  function closeActivity() {
    setModalVisible(false);

    setSelectedActivity(null);
  }

  function settingsHandler() {
    navigation.navigate("Settings");
  }

  const name = profileData?.username || authCtx.username || "Guest";

  const initial = name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* SETTINGS */}

          <Pressable style={styles.settings} onPress={settingsHandler}>
            <Ionicons
              name="reorder-three-outline"
              size={34}
              color={Colors.darkNeutral}
            />
          </Pressable>

          {/* HEADER */}

          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <Text style={styles.name}>{name}</Text>

            <Text style={styles.memberText}>
              Member since {profileData?.member_since || "loading..."}
            </Text>
          </View>

          {/* STATS */}
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator color={Colors.seaBlue2} />
            ) : error ? (
              <Text style={styles.error}>{error}</Text>
            ) : (
              <View>
                <View style={styles.statRow}>
                  <Text style={styles.globalFont}>Journals</Text>

                  <Text style={[styles.value, styles.globalFont]}>
                    {profileData?.stats?.journals}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.globalFont}>Care Logs</Text>

                  <Text style={[styles.value, styles.globalFont]}>
                    {profileData?.stats?.carelogs}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.globalFont}>Quests</Text>

                  <Text style={[styles.value, styles.globalFont]}>
                    {profileData?.stats?.quests}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.globalFont}>Streak</Text>

                  <Text style={[styles.value, styles.globalFont]}>
                    {profileData?.stats?.streak} days
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* TIMELINE */}

          {!loading && profileData?.activity && (
            <ActivityTimeline
              activity={profileData.activity}
              onSelectActivity={openActivity}
            />
          )}

          {/* MODAL */}

          <ActivityModal
            visible={modalVisible}
            activity={selectedActivity}
            onClose={closeActivity}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },

  settings: {
    position: "absolute",
    right: "5%",
    top: 10,
  },

  header: {
    alignItems: "center",
    marginTop: 35,
    marginBottom: 20,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: Colors.seaBlue2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },

  name: {
    fontSize: 23,
    fontWeight: "600",
    fontFamily: "Afacad",
  },

  memberText: {
    color: "gray",
    fontFamily: "Afacad",
  },

  card: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Afacad",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  value: {
    color: Colors.darkNeutral,
    fontWeight: "600",
  },

  error: {
    color: "red",
  },
});
