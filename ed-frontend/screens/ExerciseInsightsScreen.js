import { API_BASE_URL } from "@env";
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

function ExerciseInsightsScreen({ navigation }) {
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
      const response = await fetch(`${API_BASE_URL}/weekly-insights/`, {
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

  if (error || !weeklyData?.features?.exercise_minutes) {
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

  const { exercise_minutes } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } =
    exercise_minutes;

  const getInsight = () => {
    if (average >= 30) {
      return "Great activity level! You're moving regularly and supporting your physical and mental health. Keep this momentum!";
    } else if (average >= 15) {
      return "Good movement! You're getting regular activity. Consider increasing to 30+ minutes daily for more benefits.";
    } else {
      return "Light activity this week. Even small amounts help! Try incorporating 20-30 minutes of movement daily. Walk, stretch, dance - any movement counts!";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (average < 15) {
      suggestions.push({
        title: "Start with movement you enjoy",
        description:
          "Walking, dancing, yoga, or sports - anything that gets you moving. Pick what you enjoy!",
      });
      suggestions.push({
        title: "Build gradually",
        description:
          "Start small (10-15 min) and gradually increase as you build consistency and strength.",
      });
      suggestions.push({
        title: "Exercise has mental health benefits",
        description:
          "Movement reduces stress, improves mood, and supports your recovery journey.",
      });
    } else {
      suggestions.push({
        title: "Variety keeps it fresh",
        description:
          "Mix different types of movement - cardio, strength, flexibility - to work different body systems.",
      });
      suggestions.push({
        title: "Recovery is important too",
        description:
          "Balance activity with adequate rest and recovery to prevent burnout.",
      });
    }
    return suggestions;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />

            <View>
              <Text style={[styles.globalFont, styles.heading]}>
                Exercise Insights
              </Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.globalFont, styles.score]}>
                  {average.toFixed(0)}
                </Text>
                <Text style={[styles.globalFont, styles.ten]}>
                  minutes per day
                </Text>
              </View>
            </View>

            <View style={styles.sections}>
              <View style={[styles.section]}>
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
              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>
                  General Insights
                </Text>
                <Text style={styles.globalFont}>{getInsight()}</Text>
              </View>
  

              <View style={styles.sections}>
                

                <View style={styles.section}>
                  <Text style={[styles.globalFont, styles.subtitles]}>
                    Friendly Suggestions
                  </Text>
                  <View style={styles.suggestions}>
                    {getSuggestions().map((suggestion, index) => (
                      <View key={index} style={styles.suggestion}>
                        <Text style={[styles.globalFont, styles.bold]}>
                          {suggestion.title}
                        </Text>
                        <Text style={styles.globalFont}>
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
                    <Text style={[styles.globalFont, styles.trendArrow]}>
                      {trend_direction}
                    </Text>
                    <View>
                      <Text style={[styles.globalFont, styles.bold]}>
                        {trend === "increasing"
                          ? "Increasing"
                          : trend === "decreasing"
                            ? "Decreasing"
                            : "Stable"}
                      </Text>
                      <Text style={styles.globalFont}>
                        Change: {trend_value}/10
                      </Text>
                    </View>
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
  bold: {
    fontWeight: 600,
  },
  trendBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.seaBlue2,
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
    backgroundColor: Colors.seaBlue2,
    borderRadius: 8,
    padding: 8,
    width: "13%",
  },
  dayLabel: {
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 4,
    color: Colors.darkNeutral,
  },
  dayValue: {
    fontSize: 12,
    fontWeight: 600,
    color: Colors.darkNeutral,
  },
  suggestions: {
    gap: 12,
    marginTop: 10,
  },
  suggestion: {
    backgroundColor: Colors.seaBlue2,
    borderRadius: 12,
    padding: 12,
  },
});

export default ExerciseInsightsScreen;
