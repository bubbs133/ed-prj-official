import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";
import * as Progress from "react-native-progress";
import { AuthContext } from "../auth/auth-context";

function UrgeIntensityInsightsScreen({ navigation }) {
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
      if (!authContext.token) throw new Error("Not authenticated");
      const response = await fetch("http://127.0.0.1:8000/weekly-insights/", {
        method: "GET",
        headers: {
          Authorization: `Token ${authContext.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setWeeklyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.darkNeutral} />
      </View>
    );
  }

  if (error || !weeklyData?.features?.urge_intensity) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <GoBack navigation={navigation} />
          <Text style={[styles.globalFont, styles.heading]}>Error</Text>
          <Text style={styles.globalFont}>{error || "No data"}</Text>
        </SafeAreaView>
      </View>
    );
  }

  const { urge_intensity } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } =
    urge_intensity;

  const getInsight = () => {
    if (average > 7) {
      return "Intense urges overall this week. This is challenging - use your full toolkit of coping strategies and reach out to your support network. You can get through this.";
    } else if (average > 4) {
      return "Moderate urge intensity. You're handling it well. Keep using your coping techniques - they're helping.";
    } else {
      return "Low overall urge intensity - amazing progress! Your recovery strategies are working. Keep it up!";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    suggestions.push({
      title: "Build your coping toolkit",
      description:
        "Physical (exercise, cold water), mental (distraction, grounding), emotional (talk to someone, journal).",
    });
    if (average > 6) {
      suggestions.push({
        title: "Reach out immediately",
        description:
          "Don't wait for things to get worse. Call therapist, hotline, friend, or trusted person when urges spike.",
      });
      suggestions.push({
        title: "Remember: urges peak and pass",
        description:
          "Research shows urges typically peak within 30 minutes. Ride them out using your strategies.",
      });
    } else {
      suggestions.push({
        title: "Celebrate your strength",
        description:
          "You're successfully managing powerful urges. This is significant progress in your recovery.",
      });
    }
    return suggestions;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />

            <View>
              <Text style={[styles.globalFont, styles.heading]}>
                Urge Intensity
              </Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.globalFont, styles.score]}>{average}</Text>
                <Text style={[styles.globalFont, styles.ten]}>out of 10</Text>
              </View>
            </View>
            <View style={[styles.section, { marginBottom: 20 }]}>
              <Text style={[styles.globalFont, styles.subtitles]}>
                Daily Breakdown
              </Text>
              <View style={styles.dailyGrid}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, idx) => (
                    <View key={idx} style={styles.dayBox}>
                      <Text style={[styles.globalFont, styles.dayLabel]}>
                        {day}
                      </Text>
                      <Text style={[styles.globalFont, styles.dayValue]}>
                        {entries[idx]?.toFixed(0) || "-"}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>

            <View style={styles.sections}>
              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>
                  General Insights
                </Text>
                <Text style={styles.globalFont}>{getInsight()}</Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>
                  Friendly Suggestions
                </Text>
                <View style={styles.suggestions}>
                  {getSuggestions().map((suggestion, index) => (
                    <View key={index} style={styles.suggestion}>
                      <Text style={[styles.globalFont, styles.bold, styles.light]}>
                        {suggestion.title}
                      </Text>
                      <Text style={[styles.globalFont, styles.light]}>
                        {suggestion.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>
                  Trends
                </Text>
                <View style={styles.trendBox}>
                  <Text style={[styles.globalFont, styles.trendArrow, styles.light]}>
                    {trend_direction}
                  </Text>
                  <View>
                    <Text style={[styles.globalFont, styles.bold, styles.light]}>
                      {trend === "increasing"
                        ? "Increasing"
                        : trend === "decreasing"
                          ? "Decreasing"
                          : "Stable"}
                    </Text>
                    <Text style={[styles.globalFont, styles.light]}>
                      Change: {trend_value}/10
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 40,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  heading: {
    fontWeight: 500,
    fontSize: 24,
    textAlign: "center",
  },
  scoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 25,
  },
  score: {
    fontWeight: 500,
    fontSize: 80,
    textAlign: "center",
  },
  ten: {
    textAlign: "center",
    marginTop: -15,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  sections: {
    gap: 20,
  },
  section: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
  },
  subtitles: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 8,
  },
  light: {
    color: "#fff"
  },
  bold: {
    fontWeight: 600,
  },
  trendBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightCoffeeBrown,
    borderRadius: 10,
    padding: 12,
  },
  trendArrow: {
    fontSize: 28,
    marginRight: 12,
  },
  dailyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    alignItems: "center",
    backgroundColor: Colors.lightCoffeeBrown,
    borderRadius: 8,
    padding: 8,
    width: "13%",
  },
  dayLabel: {
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 4,
    color: "#FFFFFF",
  },
  dayValue: {
    fontSize: 12,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  suggestions: {
    gap: 12,
    marginTop: 10,
  },
  suggestion: {
    backgroundColor: Colors.lightCoffeeBrown,
    borderRadius: 12,
    padding: 12,
  },
});

export default UrgeIntensityInsightsScreen;
