import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";
import * as Progress from "react-native-progress";
import { AuthContext } from "../auth/auth-context";

function StressInsightsScreen({ navigation }) {
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

      const response = await fetch("http://127.0.0.1:8000/weekly-insights/", {
        method: "GET",
        headers: {
          "Authorization": `Token ${authContext.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setWeeklyData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
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

  if (error || !weeklyData?.features?.stress_level) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <GoBack navigation={navigation} />
          <Text style={[styles.globalFont, styles.heading]}>Error</Text>
          <Text style={styles.globalFont}>{error || "No data available"}</Text>
        </SafeAreaView>
      </View>
    );
  }

  const { stress_level } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } = stress_level;

  const getInsight = () => {
    if (average > 7) {
      return "Your stress levels have been high this week. Remember to take moments to breathe deeply and practice self-care. You're managing through a challenging time. 💪";
    } else if (average > 4) {
      return "Moderate stress this week. You're handling it well with your coping strategies. Keep them going! 😊";
    } else {
      return "Low stress levels - amazing work! Continue what you're doing. 🌟";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (average > 6) {
      suggestions.push({
        title: "Try relaxation exercises",
        description: "Deep breathing, meditation, or progressive muscle relaxation can help calm your nervous system.",
      });
    }
    if (trend === "increasing") {
      suggestions.push({
        title: "Stress is increasing",
        description: "Consider adding more stress management activities to your routine this coming week.",
      });
    }
    suggestions.push({
      title: "Keep a stress journal",
      description: "Write down what's causing stress to better understand and address the root causes.",
    });
    return suggestions;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.contentContainer}>
            <GoBack navigation={navigation} />

            {/* Header */}
            <View>
              <Text style={[styles.globalFont, styles.heading]}>Stress Insights</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.globalFont, styles.score]}>{average}</Text>
                <Text style={[styles.globalFont, styles.ten]}>out of 10</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <Progress.Bar
                progress={average / 10}
                width={Dimensions.get("window").width - 40}
                color="#E8A87C"
                height={12}
                borderRadius={6}
              />
            </View>

            {/* Sections */}
            <View style={styles.sections}>
              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>General Insights</Text>
                <Text style={styles.globalFont}>{getInsight()}</Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>Trends</Text>
                <View style={styles.trendBox}>
                  <Text style={[styles.globalFont, styles.trendArrow]}>{trend_direction}</Text>
                  <View>
                    <Text style={[styles.globalFont, styles.bold]}>
                      {trend === "increasing" ? "Increasing" : trend === "decreasing" ? "Decreasing" : "Stable"}
                    </Text>
                    <Text style={styles.globalFont}>Change: {trend_value}/10 this week</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>Daily Breakdown</Text>
                <View style={styles.dailyGrid}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                    <View key={idx} style={styles.dayBox}>
                      <Text style={[styles.globalFont, styles.dayLabel]}>{day}</Text>
                      <Text style={[styles.globalFont, styles.dayValue]}>{entries[idx]?.toFixed(0) || "-"}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>Friendly Suggestions</Text>
                <View style={styles.suggestions}>
                  {getSuggestions().map((suggestion, index) => (
                    <View key={index} style={styles.suggestion}>
                      <Text style={[styles.globalFont, styles.bold]}>{suggestion.title}</Text>
                      <Text style={styles.globalFont}>{suggestion.description}</Text>
                    </View>
                  ))}
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
    backgroundColor: Colors.seaBlue2,
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
    backgroundColor: "#FFF5E6",
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
    backgroundColor: "#E8A87C",
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
    backgroundColor: "#E8A87C",
    borderRadius: 12,
    padding: 12,
  },
});

export default StressInsightsScreen;
