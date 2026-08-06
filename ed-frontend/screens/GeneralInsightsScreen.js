import { API_BASE_URL } from "@env";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBack from "../components/GoBack";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/colors";
import * as Progress from "react-native-progress";
import { AuthContext } from "../auth/auth-context";

const GeneralInsightsScreen = ({ navigation }) => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchWeeklyInsights();
  }, [authContext.token]);

  const fetchWeeklyInsights = async () => {
    try {
      setLoading(true);
      if (!authContext.token) {
        throw new Error("Not authenticated");
      }

      const url = `${API_BASE_URL}/weekly-insights/`
      //const url = `${API_BASE_URL}/weekly-insights/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${authContext.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch weekly insights");
      }

      const data = await response.json();
      setWeeklyData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching weekly insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const featureScreenMap = {
    stress_level: "StressScreen",
    energy_level: "EnergyScreen",
    num_meals: "MealsScreen",
    sleep_hours: "SleepScreen",
    exercise_minutes: "ExerciseScreen",
    emotional_distress: "EmotionalDistressScreen",
    restriction: "RestrictionScreen",
    binge_urge: "BingeScreen",
    urge_intensity: "UrgeScreen",
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={Colors.darkNeutral}
          style={{ marginTop: 100 }}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />
            <Text style={[styles.globalFont, styles.heading]}>Uh oh!</Text>
            <Text
              style={[
                styles.globalFont,
                { textAlign: "center", fontSize: 15, paddingBottom: 40 },
              ]}
            >
              {error}
            </Text>
            <Pressable
              onPress={() => navigation.navigate("Assessment")}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Text style={[styles.globalFont, styles.checkinBtnText]}>
                Let's check in!
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!weeklyData) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />
            <Text style={[styles.globalFont, styles.heading]}>Uh oh!</Text>
            <Text style={styles.globalFont}>
              Submit some care logs to see some data! :D
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const { features } = weeklyData;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />
            <Text style={[styles.globalFont, styles.heading]}>
              Weekly Overview
            </Text>

            {/* Summary Section */}
            <View style={styles.summarySection}>
              <View style={styles.summaryBox}>
                <Text style={[styles.globalFont, { fontSize: 15 }]}>
                  You've logged {weeklyData.entries_count}{" "}
                  {weeklyData.entries_count <= 1 ? "entry" : "entries"} this
                  week. Tap any feature card to see detailed insights, trends,
                  and personalized suggestions.
                </Text>
              </View>
            </View>

            {/* Feature Cards Grid */}
            <View style={styles.gridContainer}>
              {Object.entries(features).map(([featureKey, featureData]) => (
                <TouchableOpacity
                  key={featureKey}
                  style={styles.featureCard}
                  onPress={() => {
                    const screenName = featureScreenMap[featureKey];
                    if (screenName) {
                      navigation.navigate(screenName);
                    }
                  }}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.globalFont, styles.cardLabel]}>
                      {featureData.label}
                    </Text>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.globalFont, styles.cardValue]}>
                      {featureData.average}
                    </Text>
                    <Text style={styles.globalFont}>{featureData.unit}</Text>
                  </View>

                  {/*<View style={styles.cardProgress}>
                    <Progress.Bar
                      progress={Math.min(featureData.average / 10, 1)}
                      width={140}
                      color={featureColors[featureKey]}
                      height={6}
                      borderRadius={3}
                    />
                  </View>*/}

                  <View style={styles.cardTrend}>
                    <Text style={styles.globalFont}>
                      {featureData.trend_direction} {featureData.trend_value}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "5%",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  heading: {
    fontWeight: 600,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  featureCard: {
    width: "48%",
    backgroundColor: Colors.greyish,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: 600,
    fontSize: 15,
  },
  cardContent: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 600,
  },
  cardProgress: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardTrend: {
    alignItems: "center",
    fontSize: 12,
  },
  summarySection: {
    paddingBottom: 25,
  },
  summaryTitle: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 10,
  },
  summaryBox: {
    //backgroundColor: "#F0F0F0",
  },
  checkinBtnText: {
    textAlign: "center",
    backgroundColor: Colors.greyish,
    height: "auto",
    width: "auto",
    borderRadius: 7,
    color: Colors.seaDarkBlue,
    fontWeight: 700,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default GeneralInsightsScreen;
