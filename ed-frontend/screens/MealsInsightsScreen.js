import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";
import * as Progress from "react-native-progress";
import { AuthContext } from "../auth/auth-context";

function MealsInsightsScreen({ navigation }) {
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
          "Authorization": `Token ${authContext.token}`,
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

  if (error || !weeklyData?.features?.num_meals) {
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

  const { num_meals } = weeklyData.features;
  const { average, entries, trend, trend_direction, trend_value } = num_meals;

  const getInsight = () => {
    if (average >= 2.5) {
      return "Excellent meal consistency! You're fueling your body well. Regular eating patterns support stable energy and mood. Keep it up! 🍽️";
    } else if (average >= 2) {
      return "Good meal frequency - you're doing well! Consider aiming for more consistency to optimize your energy and wellbeing. 😊";
    } else {
      return "Meal frequency is lower than recommended. Regular meals help stabilize energy, mood, and support your recovery. Try aiming for 3+ meals daily. 💪";
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (average < 2.5) {
      suggestions.push({
        title: "Establish meal times",
        description: "Set specific times for breakfast, lunch, and dinner. Consistency helps your body expect and prepare for meals.",
      });
      suggestions.push({
        title: "Prep easy options",
        description: "Simple meals count! Sandwiches, pasta, or leftovers are perfectly fine options.",
      });
      suggestions.push({
        title: "Use phone reminders",
        description: "Set alarms for meal times if you tend to forget or skip meals.",
      });
    } else {
      suggestions.push({
        title: "Variety helps",
        description: "Try to include different food groups across your meals for balanced nutrition.",
      });
      suggestions.push({
        title: "Honor your hunger",
        description: "Listen to your body's cues and eat when hungry without rigid rules.",
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
              <Text style={[styles.globalFont, styles.heading]}>Meals Insights</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.globalFont, styles.score]}>{average.toFixed(1)}</Text>
                <Text style={[styles.globalFont, styles.ten]}>per day</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Progress.Bar
                progress={Math.min(average / 5, 1)}
                width={Dimensions.get("window").width - 40}
                color="#93B3C2"
                height={12}
                borderRadius={6}
              />
            </View>

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
                    <Text style={styles.globalFont}>Change: {trend_value.toFixed(1)} meals/day</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.globalFont, styles.subtitles]}>Daily Breakdown</Text>
                <View style={styles.dailyGrid}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                    <View key={idx} style={styles.dayBox}>
                      <Text style={[styles.globalFont, styles.dayLabel]}>{day}</Text>
                      <Text style={[styles.globalFont, styles.dayValue]}>{entries[idx]?.toFixed(1) || "-"}</Text>
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
    backgroundColor: "#E8F4F8",
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
    backgroundColor: "#93B3C2",
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
    backgroundColor: "#93B3C2",
    borderRadius: 12,
    padding: 12,
  },
});

export default MealsInsightsScreen;
