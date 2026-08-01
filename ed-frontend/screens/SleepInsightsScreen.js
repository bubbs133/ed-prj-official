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

function SleepInsightsScreen({ navigation }) {
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

  if (error || !weeklyData?.features?.sleep_hours) {
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

  const { sleep_hours } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } = sleep_hours;

  const getInsight = () => {
    if (average >= 7) {
      return "Excellent sleep! 7+ hours is ideal for recovery, mood, and overall health. You're doing a great job prioritizing rest!";
    } else if (average >= 6) {
      return "Good sleep - your body is getting decent rest. Try to aim for 7-8 hours when possible for optimal wellness.";
    } else {
      return "Low sleep hours this week. Prioritize getting 7-8 hours nightly. Good sleep is crucial for mental and physical health.";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (average < 6) {
      suggestions.push({
        title: "Create a bedtime routine",
        description:
          "Go to bed and wake at consistent times. A calming routine signals your body it's time to rest.",
      });
      suggestions.push({
        title: "Limit screens before bed",
        description:
          "Blue light disrupts sleep. Try avoiding screens 30-60 minutes before bedtime.",
      });
      suggestions.push({
        title: "Optimize your environment",
        description:
          "Keep your bedroom cool, dark, and quiet for better sleep quality.",
      });
    } else {
      suggestions.push({
        title: "Maintain this rhythm",
        description:
          "You've found a good sleep schedule - keep it consistent for better sleep quality.",
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
                Sleep Insights
              </Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.globalFont, styles.score]}>
                  {average.toFixed(1)}
                </Text>
                <Text style={[styles.globalFont, styles.ten]}>
                  hours per night
                </Text>
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
    color: Colors.darkBlueText,
  },
  dayValue: {
    fontSize: 12,
    fontWeight: 600,
    color: Colors.darkBlueText,
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

export default SleepInsightsScreen;
