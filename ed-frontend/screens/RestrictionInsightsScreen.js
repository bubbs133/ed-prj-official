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

function RestrictionInsightsScreen({ navigation }) {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchWeeklyInsights();
  }, [authContext.token]);

  const fetchWeeklyInsights = async () => {
    const url = `${API_BASE_URL}/weekly-insights/`
    //const url = `${API_BASE_URL}/weekly-insights/`
    try {
      setLoading(true);
      if (!authContext.token) throw new Error("Not authenticated");
      const response = await fetch(url, {
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

  if (error || !weeklyData?.features?.restriction) {
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

  const { restriction } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } = restriction;

  const getInsight = () => {
    if (average > 6) {
      return "Strong restriction urges this week. These urges are valid but remember: restriction fuels the disorder. Challenge these thoughts with compassion for yourself.";
    } else if (average > 3) {
      return "Moderate restriction urges. You're managing them well. Keep challenging and practicing flexibility with food. Great progress!";
    } else {
      return "Low restriction urges - amazing! You're breaking free from these patterns. Celebrate your progress and keep going!";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (average > 5) {
      suggestions.push({
        title: "Challenge restriction thoughts",
        description:
          "When the urge appears, ask: 'Is this thought helpful? What do I need right now?'",
      });
      suggestions.push({
        title: "Practice challenge meals",
        description:
          "Eat foods you fear or restrict in a safe environment with support. Expose yourself to reduce anxiety.",
      });
      suggestions.push({
        title: "Talk to your support team",
        description:
          "Share these urges with therapist, dietitian, or trusted person. You don't have to face this alone.",
      });
    } else {
      suggestions.push({
        title: "Celebrate your wins",
        description:
          "Every meal eaten without restriction is a victory. Acknowledge your strength and progress!",
      });
      suggestions.push({
        title: "Build flexibility",
        description:
          "Practice eating a variety of foods, including former fear foods, to reinforce that all foods are okay.",
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
                Restriction Urges
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

export default RestrictionInsightsScreen;
