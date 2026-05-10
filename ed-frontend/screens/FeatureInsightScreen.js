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

const FeatureInsightScreen = ({ navigation, route }) => {
  const [weeklyData, setWeeklyData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const authContext = useContext(AuthContext);

  const { featureKey, featureConfig } = route.params;

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
          Authorization: `Token ${authContext.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch weekly insights");
      }

      setWeeklyData(data);
    } catch (err) {
      console.error("Weekly insights error:", err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.darkNeutral} />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <GoBack navigation={navigation} />

          <Text style={styles.errorTitle}>Error</Text>

          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!weeklyData?.features?.[featureKey]) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <GoBack navigation={navigation} />

          <Text style={styles.errorTitle}>No Data</Text>

          <Text style={styles.errorText}>No weekly data available yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const featureData = weeklyData.features[featureKey];

  const {
    label,
    average,
    entries,
    trend,
    trend_direction,
    trend_value,
    insights,
  } = featureData;

  const progressColor = featureConfig?.color || "#93B3C2";

  const maxValue = featureConfig?.maxValue || 10;

  const unit = featureConfig?.unit || "/10";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <GoBack navigation={navigation} />

          {/* Heading */}

          <Text style={styles.featureLabel}>{label}</Text>

          {featureConfig?.description && (
            <Text style={styles.featureDescription}>
              {featureConfig.description}
            </Text>
          )}

          <Text style={styles.weekRange}>
            {weeklyData.week.start} → {weeklyData.week.end}
          </Text>

          {/* Score */}

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{average}</Text>

            <Text style={styles.scoreUnit}>{unit}</Text>
          </View>

          <View style={styles.averageBadge}>
            <Text style={styles.averageBadgeText}>Weekly Average</Text>
          </View>

          {/* Progress */}

          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={Math.min(average / maxValue, 1)}
              width={Dimensions.get("window").width - 50}
              height={14}
              color={progressColor}
              unfilledColor="#E8E8E8"
              borderWidth={0}
              borderRadius={10}
            />
          </View>

          {/* General Insights */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Insights</Text>

            <Text style={styles.insightText}>{insights.general_insight}</Text>
          </View>

          {/* Trend */}

          <View
            style={[
              styles.section,
              styles.trendBox,
              {
                backgroundColor:
                  trend === "increasing"
                    ? "#FFF4E5"
                    : trend === "decreasing"
                      ? "#E8F5E9"
                      : "#F5F5F5",
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Weekly Trend</Text>

            <Text style={styles.trendText}>
              {trend_direction} {insights.trend_message}
            </Text>

            <Text style={styles.trendSubtext}>
              {trend === "increasing"
                ? "This metric rose throughout the week."
                : trend === "decreasing"
                  ? "This metric lowered throughout the week."
                  : "This metric stayed relatively stable."}
            </Text>

            <Text style={styles.trendValue}>Change: {trend_value}</Text>
          </View>

          {/* Daily Breakdown */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Breakdown</Text>

            <View style={styles.dailyGrid}>
              {entries.map((value, index) => {
                const safeOpacity =
                  value !== null ? Math.max(value / maxValue, 0.2) : 0.15;

                return (
                  <View key={index} style={styles.dailyBox}>
                    <Text style={styles.dayLabel}>{days[index]}</Text>

                    <View
                      style={[
                        styles.dayValue,
                        {
                          backgroundColor: progressColor,
                          opacity: safeOpacity,
                        },
                      ]}
                    >
                      <Text style={styles.dayNumber}>
                        {value !== null ? value : "-"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Suggestions */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friendly Suggestions</Text>

            {insights?.suggestions?.length > 0 ? (
              insights.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionBox}>
                  <Text style={styles.suggestionBullet}>•</Text>

                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.suggestionText}>
                No suggestions available yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeatureInsightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  scrollContent: {
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  featureLabel: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.darkNeutral,
    marginTop: 20,
  },

  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.mediumNeutral,
    marginTop: 8,
  },

  weekRange: {
    fontSize: 13,
    color: Colors.mediumNeutral,
    marginTop: 10,
    marginBottom: 25,
  },

  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  scoreValue: {
    fontSize: 72,
    fontWeight: "700",
    color: Colors.darkNeutral,
  },

  scoreUnit: {
    fontSize: 24,
    marginTop: 12,
    marginLeft: 8,
    color: Colors.mediumNeutral,
  },

  averageBadge: {
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -5,
    marginBottom: 24,
  },

  averageBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.darkNeutral,
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.darkNeutral,
    marginBottom: 10,
  },

  insightText: {
    fontSize: 14,
    lineHeight: 23,
    color: Colors.darkNeutral,
  },

  trendBox: {
    padding: 16,
    borderRadius: 14,
  },

  trendText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.darkNeutral,
  },

  trendSubtext: {
    fontSize: 12,
    color: Colors.mediumNeutral,
    marginTop: 4,
    marginBottom: 10,
  },

  trendValue: {
    fontSize: 13,
    color: Colors.mediumNeutral,
  },

  dailyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  dailyBox: {
    alignItems: "center",
  },

  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.darkNeutral,
    marginBottom: 8,
  },

  dayValue: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  dayNumber: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 12,
  },

  suggestionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    backgroundColor: "#F7F7F7",
    padding: 14,
    borderRadius: 12,
  },

  suggestionBullet: {
    fontSize: 18,
    marginRight: 10,
    color: Colors.darkNeutral,
  },

  suggestionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.darkNeutral,
  },

  errorTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.darkNeutral,
    marginTop: 40,
    marginBottom: 10,
  },

  errorText: {
    fontSize: 14,
    color: Colors.mediumNeutral,
    lineHeight: 22,
  },
});
